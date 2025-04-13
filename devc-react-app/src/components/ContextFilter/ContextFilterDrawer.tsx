// components/filters/ContextFilterDrawer.tsx
import { Dialog } from '@headlessui/react'
import { format, subDays } from 'date-fns'
import { useState } from 'react'
import CheckboxFilterSection from './CheckboxFilterSection'
import styles from './ContextFilterDrawer.module.css'
import DateFilter from './DateFilter'

export default function ContextFilterDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [dateRange, setDateRange] = useState('30')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [regions, setRegions] = useState<string[]>([])
    const [badGuys, setBadGuys] = useState<string[]>([])

    const regionOptions = ['North', 'South', 'East', 'West']
    const badGuyOptions = ['Hales', 'Cinderella Stepmother', 'Bertie', 'Bertie 2.0', 'Bertie 3.0', 'Bertie 4.0', 'Bertie 5.0', 'Bertie 6.0']

    const updateDateRange = (range: string) => {
        setDateRange(range)
        const today = new Date()
        let fromDate = today
        if (range === '30') fromDate = subDays(today, 30)
        else if (range === '90') fromDate = subDays(today, 90)
        else if (range === '365') fromDate = subDays(today, 365)

        setEndDate(format(today, 'yyyy-MM-dd'))
        setStartDate(format(fromDate, 'yyyy-MM-dd'))
    }

    const toggleCheckbox = (list: string[], setList: (v: string[]) => void, value: string) => {
        setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
    }

    const handleSelectAll = (list: string[], setList: (v: string[]) => void, options: string[]) => {
        const allSelected = list.length === options.length
        setList(allSelected ? [] : [...options])
    }

    const resetFilters = () => {
        updateDateRange('30')
        setRegions([])
        setBadGuys([])
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className={styles.overlay} aria-hidden="true" />
            <div className={styles.drawerPanel}>
                <Dialog.Title className={styles.title}>Filter Context</Dialog.Title>

                <DateFilter
                    dateRange={dateRange}
                    startDate={startDate}
                    endDate={endDate}
                    onRangeChange={updateDateRange}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                />

                <CheckboxFilterSection
                    title="Regions"
                    options={regionOptions}
                    selected={regions}
                    onSelectAll={() => handleSelectAll(regions, setRegions, regionOptions)}
                    onToggle={(val) => toggleCheckbox(regions, setRegions, val)}
                />

                <CheckboxFilterSection
                    title="Bad Buy Reasons"
                    options={badGuyOptions}
                    selected={badGuys}
                    onSelectAll={() => handleSelectAll(badGuys, setBadGuys, badGuyOptions)}
                    onToggle={(val) => toggleCheckbox(badGuys, setBadGuys, val)}
                />

                <div className={styles.footer}>
                    <button onClick={resetFilters} className={styles.reset}>Reset</button>
                    <div>
                        <button onClick={onClose} className={styles.cancel}>Cancel</button>
                        <button
                            onClick={() => {
                                console.log({ dateRange, startDate, endDate, regions, badGuys })
                                onClose()
                            }}
                            className={styles.apply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
