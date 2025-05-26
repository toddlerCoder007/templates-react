import { DatePicker, Space, Typography } from 'antd';
import { useState } from 'react';

const { Title } = Typography;

const QuarterPickerDemo = () => {
    const [quarter, setQuarter] = useState<string | null>(null);

    const handleChange = (date, dateString: string) => {
        setQuarter(dateString);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Title level={4}>Select a Quarter</Title>
            <Space direction="vertical">
                <DatePicker picker="quarter" onChange={handleChange} />
                {quarter && <p>Selected Quarter: <strong>{quarter}</strong></p>}
            </Space>
        </div>
    );
};

export default QuarterPickerDemo;
