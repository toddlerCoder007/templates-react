import { DatePicker, Radio, RadioChangeEvent, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';

const { RangePicker } = DatePicker;
const { Title } = Typography;

type FilterType = 'all' | 'month' | 'quarter' | 'year' | 'custom';

const DateFilterComponent: React.FC = () => {
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [dateValue, setDateValue] = useState<any>(null);

    const onFilterChange = (e: RadioChangeEvent) => {
        setFilterType(e.target.value);
        setDateValue(null); // Reset on change
    };

    // Disable dates after today
    const disabledFutureDates = (current: Dayjs) => {
        return current && current > dayjs().endOf('day');
    };

    const renderPicker = () => {
        switch (filterType) {
            case 'month':
                return (
                    <DatePicker
                        picker="month"
                        value={dateValue}
                        onChange={(date) => setDateValue(date)}
                        disabledDate={disabledFutureDates}
                        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                    />
                );
            case 'quarter':
                return (
                    <DatePicker
                        picker="quarter"
                        value={dateValue}
                        onChange={(date) => setDateValue(date)}
                        disabledDate={disabledFutureDates}
                    />
                );
            case 'year':
                return (
                    <DatePicker
                        picker="year"
                        value={dateValue}
                        onChange={(date) => setDateValue(date)}
                        disabledDate={disabledFutureDates}
                    />
                );
            case 'custom':
                return (
                    <RangePicker
                        value={dateValue}
                        onChange={(dates) => setDateValue(dates)}
                        disabledDate={disabledFutureDates}
                    />
                );
            default:
                return (
                    <DatePicker
                        disabled
                        placeholder="Date Picker disabled (Entire history)"
                    />
                );
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Title level={4}>Dynamic Date Filter</Title>
            <Space direction="vertical" size="middle">
                <Radio.Group onChange={onFilterChange} value={filterType}>
                    <Radio value="all">Entire History</Radio>
                    <Radio value="month">Filter by Month</Radio>
                    <Radio value="quarter">Filter by Quarter</Radio>
                    <Radio value="year">Filter by Year</Radio>
                    <Radio value="custom">Custom Range</Radio>
                </Radio.Group>

                {renderPicker()}
            </Space>
        </div>
    );
};

export default DateFilterComponent;
