import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing both down and up arrows
import styles from './CheckboxFilterSection.module.css'

interface Props {
    title: string
    options: string[]
    selected: string[]
    onSelectAll: () => void
    onToggle: (val: string) => void
}

const CheckboxFilterSection: React.FC<Props> = ({
    title,
    options,
    selected,
    onSelectAll,
    onToggle,
}) => {
    const [visibleCount, setVisibleCount] = useState(5)
    const [isExpanded, setIsExpanded] = useState(false)  // Track the expanded state

    const toggleVisibility = () => {
        if (isExpanded) {
            setVisibleCount(5)  // Reset to show only 5 items when collapsed
        } else {
            setVisibleCount(options.length)  // Show all items when expanded
        }
        setIsExpanded(!isExpanded)  // Toggle the state
    }

    const visibleOptions = options.slice(0, visibleCount)

    // Only show "Load More" button if there are more than 5 options
    const showLoadMore = options.length > 5

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={selected.length === options.length}
                        onChange={onSelectAll}
                    />
                    Select All
                </label>
            </div>

            <div className={styles.grid}>
                {visibleOptions.map(option => (
                    <label key={option} className={styles.label}>
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => onToggle(option)}
                        />
                        {option}
                    </label>
                ))}
            </div>

            {/* Only render "Load More" if there are more than 5 options */}
            {showLoadMore && (
                <div className={styles.loadMore} onClick={toggleVisibility}>
                    {isExpanded ? (
                        <>
                            <FaChevronUp className={styles.arrowIcon} />
                            <span>Show Less</span>
                        </>
                    ) : (
                        <>
                            <FaChevronDown className={styles.arrowIcon} />
                            <span>Load More</span>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default CheckboxFilterSection
