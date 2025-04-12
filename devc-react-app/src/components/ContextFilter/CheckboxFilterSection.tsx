// components/filters/CheckboxFilterSection.tsx
import React from 'react'
import styles from './CheckboxFilterSection.module.css'

interface Props {
    title: string
    options: string[]
    selected: string[]
    onSelectAll: () => void
    onToggle: (val: string) => void
}

const CheckboxFilterSection: React.FC<Props> = ({ title, options, selected, onSelectAll, onToggle }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <label><input type="checkbox" checked={selected.length === options.length} onChange={onSelectAll} /> Select All</label>
            </div>
            <div className={styles.grid}>
                {options.map(option => (
                    <label key={option} className={styles.label}>
                        <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    )
}

export default CheckboxFilterSection
