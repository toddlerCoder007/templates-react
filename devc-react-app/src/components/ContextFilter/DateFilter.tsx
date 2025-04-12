// components/filters/DateFilter.tsx
import React from 'react'
import styles from './DateFilter.module.css'

interface Props {
    dateRange: string
    startDate: string
    endDate: string
    onRangeChange: (val: string) => void
    onStartChange: (val: string) => void
    onEndChange: (val: string) => void
}

const DateFilter: React.FC<Props> = ({ dateRange, startDate, endDate, onRangeChange, onStartChange, onEndChange }) => {
    return (
        <div className={styles.card}>
            <div className={styles.title}>Date Filter</div>
            <div className={styles.dateRow}>
                <div className={styles.dateField}>
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={e => onStartChange(e.target.value)} />
                </div>
                <div className={styles.dateField}>
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={e => onEndChange(e.target.value)} />
                </div>
            </div>
            <div className={styles.radioColumn}>
                <label><input type="radio" checked={dateRange === '30'} onChange={() => onRangeChange('30')} /> Last 30 Days</label>
                <label><input type="radio" checked={dateRange === '90'} onChange={() => onRangeChange('90')} /> Last 90 Days</label>
                <label><input type="radio" checked={dateRange === '365'} onChange={() => onRangeChange('365')} /> Last 1 Year</label>
            </div>
        </div>
    )
}

export default DateFilter
