import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioProps,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  DatePickerProps,
  DateView,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import log from "loglevel";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_FILTERS } from "../../constants/defaultFilters";
import { ReportTypeEnum } from "../../enums/reportType.enum";
import { IDateFilterProps } from "../../interfaces/DateFilterProps.interface";
import { IRadioButtonOption } from "../../interfaces/RadioButton.interface";
import { convertEnumToOption } from "../../utils/ConvertEnumToOption.util";
import {
  quarterPickerDisabledMonths,
  SnapToNearestQuarterMonth,
} from "../../utils/ConvertNearestQuarterMonth.util";

export const DateFilter: React.FC<IDateFilterProps> = (
  props: IDateFilterProps,
) => {
  const { filters, setFilters } = props;

  const prevReportTypeRef = useRef<string | null>(null);
  const prevStartDateRef = useRef<Dayjs>(dayjs());

  const [datePickerView, setDatePickerView] = useState<DateView[]>(["day"]);
  const [displayFormat, setDisplayFormat] = useState<string>("");
  const [datePickerLabel, setDatePickerLabel] = useState<string>("");

  const shouldDisableMonth = (month: { month: () => number }) => {
    return quarterPickerDisabledMonths.includes(month.month());
  };

  const reportTypeValue =
    ReportTypeEnum[filters.reportType as keyof typeof ReportTypeEnum];

  const options: IRadioButtonOption[] = convertEnumToOption(ReportTypeEnum);

  const handleReportTypeChange = (selectionEnum: string) => {
    setFilters((prev) => ({
      ...prev,
      reportType: selectionEnum,
    }));
  };

  const handleEndDateChange = (date: Dayjs | null): void => {
    if (date) {
      setFilters((prev) => ({
        ...prev,
        endDate: date,
      }));
    } else {
      log.info("End Date Empty");
    }
  };

  const changeStartDate = useCallback(
    (date: Dayjs) => {
      let startDate;
      let endDate;

      // if user previous option is Entire History, than navigating away from that will reset date to be today's date
      if (
        prevReportTypeRef.current === ReportTypeEnum.EntireHistory &&
        reportTypeValue !== ReportTypeEnum.EntireHistory
      ) {
        date = dayjs();
      }

      switch (reportTypeValue) {
        case ReportTypeEnum.Month:
          startDate = date.startOf("month");
          endDate = date.endOf("month");
          setDatePickerLabel("Select Month");
          break;
        case ReportTypeEnum.Quarter:
          if (quarterPickerDisabledMonths.includes(date.month())) {
            date = SnapToNearestQuarterMonth(date);
          }
          startDate = date.startOf("month");
          endDate = date.add(2, "month").endOf("month");
          setDatePickerLabel("Select Quarter");
          break;
        case ReportTypeEnum.Year:
          startDate = date.startOf("year");
          endDate = date.endOf("year");
          setDatePickerLabel("Select Year");
          break;
        case ReportTypeEnum.CustomRange:
          startDate = date;
          endDate = dayjs();
          setDatePickerLabel("Start Date");
          break;
        default:
          startDate = DEFAULT_FILTERS.startDate;
          endDate = DEFAULT_FILTERS.endDate;
          setDatePickerLabel("Entire History");
          break;
      }

      if (endDate.isAfter(dayjs())) {
        endDate = dayjs();
      }

      setFilters((prev) => ({
        ...prev,
        startDate: startDate,
        endDate: endDate,
      }));

      prevReportTypeRef.current = reportTypeValue;
      prevStartDateRef.current = startDate;
    },
    [reportTypeValue, setFilters],
  );

  // set start and end date based on value chosen
  const handleStartDateChange = useCallback(
    (date: Dayjs | null): void => {
      if (!date) {
        date = prevStartDateRef.current;
      }
      changeStartDate(date);
    },
    [prevStartDateRef, changeStartDate],
  );

  // on report type change, update start end date accordingly
  useEffect(() => {
    handleStartDateChange(null);
  }, [filters.reportType, handleStartDateChange]);

  // handleDatePickerViews
  useEffect(() => {
    switch (reportTypeValue) {
      case ReportTypeEnum.Month:
        setDatePickerView(["month", "year"]);
        setDisplayFormat("MMM-YYYY");
        break;
      case ReportTypeEnum.Quarter:
        setDatePickerView(["month", "year"]);
        setDisplayFormat("MMM-YYYY");
        break;
      case ReportTypeEnum.Year:
        setDatePickerView(["year"]);
        setDisplayFormat("YYYY");
        break;
      case ReportTypeEnum.CustomRange:
        setDatePickerView(["year", "month", "day"]);
        setDisplayFormat("DD/MM/YYYY");
        break;
      default:
        setDisplayFormat("DD/MM/YYYY");
        setDatePickerView(["day"]);
        break;
    }
  }, [reportTypeValue]);

  function getQuarterLabel(date: Dayjs | null): string {
    if (!date) return "";
    const month = date.month();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${date.year()}`;
  }

  const QuarterInput = React.forwardRef(function QuarterInput(
    props: TextFieldProps,
    ref: React.Ref<HTMLInputElement>,
  ) {
    const {
      InputProps,
      inputProps,
      value,
      label,
      onClick,
      onKeyDown,
      onFocus,
      ...rest
    } = props;

    const parsedDate = dayjs(value as string | undefined);
    const displayValue = parsedDate.isValid()
      ? getQuarterLabel(parsedDate)
      : "";

    return (
      <TextField
        {...rest}
        label={label}
        inputRef={ref}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        value={displayValue}
        InputProps={{
          ...InputProps,
          readOnly: true,
        }}
        inputProps={{
          ...inputProps,
        }}
        placeholder="Select Quarter"
      />
    );
  });

  const StyledDatePicker = (props: DatePickerProps<Dayjs>) => {
    return (
      <DatePicker
        format="DD-MMM-YY"
        views={["month", "year"]}
        {...props}
        slotProps={{
          openPickerButton: {
            "aria-label": "calendar-toggle-button",
          },
          textField: {
            size: "small",
            sx: {
              backgroundColor: "white",
              borderColor: "transparent",
            },
          },
        }}
      />
    );
  };

  const CustomRadioButton = (props: RadioProps) => {
    return (
      <Radio
        {...props}
        sx={{
          padding: "4px",
          "& .MuiSvgIcon-root": {
            fontSize: "16px",
          },
          width: "14px",
          height: "14px",
          color: "#ccc",
          "&.Mui-checked": {
            color: "#0066FF",
          },
          "&:hover": {
            color: "#0066FF",
          },
          ...props.sx,
        }}
      />
    );
  };

  const CustomDatePicker = () => {
    return (
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} sx={{ display: "flex" }}>
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "#121212",
                  paddingBottom: "8px",
                }}
              >
                {datePickerLabel}
              </Typography>
              <StyledDatePicker
                views={datePickerView}
                onAccept={handleStartDateChange}
                format={displayFormat}
                value={
                  reportTypeValue === ReportTypeEnum.EntireHistory
                    ? null
                    : filters.startDate
                }
                maxDate={
                  reportTypeValue === ReportTypeEnum.CustomRange
                    ? filters.endDate
                    : undefined
                }
                disableFuture
                disabled={reportTypeValue === ReportTypeEnum.EntireHistory}
                shouldDisableMonth={
                  reportTypeValue === ReportTypeEnum.Quarter
                    ? shouldDisableMonth
                    : undefined
                }
                slots={{
                  textField:
                    reportTypeValue === ReportTypeEnum.Quarter
                      ? QuarterInput
                      : undefined,
                }}
              />
            </Box>

            {reportTypeValue === ReportTypeEnum.CustomRange && (
              <Box>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "#121212",
                    paddingBottom: "8px",
                  }}
                >
                  End Date
                </Typography>
                <StyledDatePicker
                  views={["day"]}
                  onAccept={handleEndDateChange}
                  format="DD/MM/YYYY"
                  value={filters.endDate}
                  minDate={filters.startDate}
                  disableFuture
                />
              </Box>
            )}
          </Stack>
        </LocalizationProvider>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "hsl(220, 14%, 96%)",
        padding: "16px",
        border: "1px solid #e5e7eb",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <CustomDatePicker />
      </Box>

      <RadioGroup
        aria-label="date-filter-type"
        value={filters.reportType}
        onChange={(e) => handleReportTypeChange(e.target.value)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          paddingLeft: "10px",
        }}
      >
        {options.map((option: IRadioButtonOption) => (
          <FormControlLabel
            key={option.label}
            value={option.value}
            control={<CustomRadioButton />}
            label={option.label}
            sx={{
              alignItems: "center",
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                paddingLeft: "4px",
                color:
                  filters.reportType === option.value ? "#0066FF" : "#121212",
              },
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};
