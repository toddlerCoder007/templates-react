import { Card, DatePicker, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

const { Title, Text } = Typography;

const getQuarterRange = (quarterString: string) => {
  const [year, q] = quarterString.split('-Q');
  const startMonth = (parseInt(q) - 1) * 3;
  const start = dayjs(`${year}-${String(startMonth + 1).padStart(2, '0')}-01`);
  const end = start.add(3, 'month').subtract(1, 'day');
  return {
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  };
};

const App: React.FC = () => {
  const [quarter, setQuarter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

  const handleQuarterChange = (_: any, dateString: string) => {
    setQuarter(dateString);
    if (dateString) {
      const range = getQuarterRange(dateString);
      setDateRange(range);
    } else {
      setDateRange(null);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3}>Quarter Picker Demo (Ant Design)</Title>
      <Space direction="vertical" size="large">
        <DatePicker picker="quarter" onChange={handleQuarterChange} />

        {quarter && dateRange && (
          <Card title={`Selected: ${quarter}`} style={{ width: 300 }}>
            <Text><strong>Start Date:</strong> {dateRange.startDate}</Text><br />
            <Text><strong>End Date:</strong> {dateRange.endDate}</Text>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default App;
