import {MonochromeBarChart} from './components/ui/monochrome-bar-chart';
import {RoundedPieChart} from './components/ui/rounded-pie-chart';

export default function HomePage() {
    return (
        <div className='flex w-full gap-4'>
            <MonochromeBarChart className="w-1/2" />
            <RoundedPieChart className="w-1/2" />
        </div>
    );
}