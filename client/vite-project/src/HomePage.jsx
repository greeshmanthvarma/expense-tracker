import React from 'react';
import {MonochromeBarChart} from './components/ui/monochrome-bar-chart';
import {RoundedPieChart} from './components/ui/rounded-pie-chart';
import AnimatedTabs from './components/animatedTabs';

export default function HomePage() {
    const [activeTab, setActiveTab] = React.useState('personal');
    const tabs = [
        { id: 'personal', label: 'Personal' },
        { id: 'group', label: 'Group' },
    ];
    return (
        <div className='flex flex-col w-full gap-4 mt-4'>
            <div className='flex justify-between mt-4'>
            <AnimatedTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} layoutId='home-tabs' textColor='text-white' textHoverColor='text-gray-600' />
            </div>
            {activeTab === 'personal' && (
                <div className='flex w-full gap-4'>
                    <MonochromeBarChart className="w-1/2 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/10" type='personal' />
                    <RoundedPieChart className="w-1/2 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/10" type='personal' />
                </div>
            )}
            {activeTab === 'group' && (
                <div className='flex w-full gap-4'>
                    <MonochromeBarChart className="w-1/2 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/10" type='group' />
                    <RoundedPieChart className="w-1/2 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/10" type='group' />
                </div>
            )}
        </div>
    );
}