function calculateExpenseDifference(monthlyExpenses) {
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = monthlyExpenses[currentMonth] || 0;
  
  let previousMonthExpenses = 0;
  let previousMonthIndex = -1;
  
  if (currentMonth > 0) {
    previousMonthIndex = currentMonth - 1;
    previousMonthExpenses = monthlyExpenses[previousMonthIndex] || 0;
  }
  
  if (previousMonthExpenses === 0) {
    for (let i = currentMonth - 1; i >= 0; i--) {
      if (monthlyExpenses[i] && monthlyExpenses[i] > 0) {
        previousMonthExpenses = monthlyExpenses[i];
        previousMonthIndex = i;
        break;
      }
    }
  }
  
  let expenseDiffPercentage = 0;
  
  if (previousMonthExpenses > 0) {
    expenseDiffPercentage = ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;
  }
  
  return expenseDiffPercentage;
}

async function fetchExpenses(){
  try{
    const response = await fetch('/api/expense',{
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })
    
    if (response.ok) {
      const data = await response.json();
      return data.expenses || [];
    }
    return [];
  }
  catch(error){
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function getMonthlyExpenses(){
  const expenses = await fetchExpenses();
  const monthlyExpenses = {};
  let totalExpenses = 0;
  for(const expense of expenses){
      const date = new Date(expense.createdAt);
      const currentYear = new Date().getFullYear();
      const expenseYear = date.getFullYear();
      if(expenseYear !== currentYear){
        continue;
      }
      const month = date.getMonth(); 
      if(!monthlyExpenses[month]){
          monthlyExpenses[month] = 0;
      }
      monthlyExpenses[month] += parseFloat(expense.price);
      totalExpenses += parseFloat(expense.price);
  };
  const expenseDiffPercentage = calculateExpenseDifference(monthlyExpenses);
  return {monthlyExpenses, expenseDiffPercentage, totalExpenses};
}

export async function getCategoryExpenses(){
    const expenses = await fetchExpenses();
    const categoryExpenses = {};

    expenses.forEach(expense =>{
        const category = expense.category;
        if(!categoryExpenses[category]){
            categoryExpenses[category] = 0;
        }
        categoryExpenses[category] += parseFloat(expense.price);
    });

    return categoryExpenses;
   
}

export async function fetchGroupExpenses(groupId){
  try{
    const response = await fetch(`/api/groupExpenses/${groupId}`,{
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })
    
    if (response.ok) {
      const data = await response.json();
      return data.groupExpenses || [];
    }
    return [];
  }
  catch(error){
    console.error('Error fetching group expenses:', error);
    return [];
  }
}

export async function getGroupBills(groupId){
  try{
    const response = await fetch(`/api/groupExpenses/bill/${groupId}`,{
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      },
      credentials:'include'
    })
    if (response.ok) {
      const data = await response.json();
        return data.groupBills || [];
      }
      return [];
    }
    catch(error){
      console.error('Error fetching group bills:', error);
      return [];
    }
}

export async function getGroupMonthlyExpenses(userId){
  let totalExpenses = 0;
  let groups = [];
  try {
    const response = await fetch('/api/groups', {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      groups = data.groups || [];
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
    return {monthlyExpenses: {}, expenseDiffPercentage: 0, totalExpenses: 0};
  }

  if (!groups || groups.length === 0) {
    return {monthlyExpenses: {}, expenseDiffPercentage: 0, totalExpenses: 0};
  }

  const groupExpenses = [];
  const groupBills = [];
  
  for(const group of groups){
    const expenses = await fetchGroupExpenses(group.id);
    const bills = await getGroupBills(group.id);
    groupExpenses.push(...expenses);
    groupBills.push(...bills);
  }
  
  const monthlyExpenses = {};
  const currentYear = new Date().getFullYear();
  
  for(const expense of groupExpenses){
    const date = new Date(expense.createdAt);
    const month = date.getMonth();
    const year = date.getFullYear();
    if(year !== currentYear){
      continue;
    }
    if(!monthlyExpenses[month]){
      monthlyExpenses[month] = 0;
    }
    const expenseSplits = expense.expenseSplit;
    for(const split of expenseSplits){
      if(split.userId === userId){
        monthlyExpenses[month] += parseFloat(split.amountOwed);
        totalExpenses += parseFloat(split.amountOwed);
      }
    }
  }
  
  for(const bill of groupBills){
    const date = new Date(bill.createdAt);
    const month = date.getMonth();
    const year = date.getFullYear();
    if(year !== currentYear){
      continue;
    }
    if(!monthlyExpenses[month]){
      monthlyExpenses[month] = 0;
    }
    const items = bill.items || [];
    for(const item of items){
      if(item.owers && Array.isArray(item.owers) && item.owers.length > 0){
        const isOwer = item.owers.some(ower => ower.id === userId);
        if(isOwer){
          const userShare = parseFloat(item.price) / item.owers.length;
          monthlyExpenses[month] += userShare;
          totalExpenses += userShare;
        }
      }
    }
  }
  
  const expenseDiffPercentage = calculateExpenseDifference(monthlyExpenses);
  
  return {monthlyExpenses, expenseDiffPercentage, totalExpenses};
}


export async function getGroupWiseExpenses(userId){
  let groups = []
  try {
    const response = await fetch('/api/groups', {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      groups = data.groups || [];
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
    return {};
  }

  if (!groups || groups.length === 0) {
    return {};
  }

  const groupWiseExpenses = {};
  
  for(const group of groups){
    let userShare = 0;
    
    const expenses = await fetchGroupExpenses(group.id);
    for(const expense of expenses){
      const expenseSplits = expense.expenseSplit || [];
      for(const split of expenseSplits){
        if(split.userId === userId){
          userShare += parseFloat(split.amountOwed);
        }
      }
    }
    
    const bills = await getGroupBills(group.id);
    for(const bill of bills){
      const items = bill.items || [];
      for(const item of items){
        if(item.owers && Array.isArray(item.owers) && item.owers.length > 0){
          const isOwer = item.owers.some(ower => ower.id === userId);
          if(isOwer){
            const userSharePerItem = parseFloat(item.price) / item.owers.length;
            userShare += userSharePerItem;
          }
        }
      }
    }
    
    if(userShare > 0){
      groupWiseExpenses[group.name] = userShare;
    }
  }

  return groupWiseExpenses;
}