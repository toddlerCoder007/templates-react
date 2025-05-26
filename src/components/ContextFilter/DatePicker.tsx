import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = () => {
    const [date, setDate] = useState<Dayjs>(dayjs());

    return (
        <DatePicker
            selected={date.toDate()}  // Convert Dayjs to native Date object
            onChange={(date: Date) => setDate(dayjs(date))}  // Update the Dayjs state
            dateFormat="MM/yyyy"  // Display month and year format
            showMonthYearPicker  // Enable month and year picker
        />
    );
};

export default MyDatePicker;
