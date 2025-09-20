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

  expenses.forEach(expense => {
      const date = new Date(expense.createdAt);
      const month = date.getMonth(); // 0 for January, 1 for February, etc.
      if(!monthlyExpenses[month]){
          monthlyExpenses[month] = 0;
      }
      monthlyExpenses[month] += parseFloat(expense.price);
  });
  return monthlyExpenses;
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