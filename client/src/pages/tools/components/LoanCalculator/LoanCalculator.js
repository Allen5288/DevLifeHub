/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  Grid,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Button,
  Collapse,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip as ChartTooltip,
} from 'chart.js';
import { styled } from '@mui/material/styles';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartTooltip
);

const tooltipTexts = {
  loanAmount: 'The total amount you wish to borrow',
  loanTerm: 'The duration of the loan in years',
  interestRate: 'Annual interest rate as a percentage',
};

const currencyConfig = {
  CNY: {
    symbol: '¥',
    name: 'Chinese Yuan',
    locale: 'zh-CN',
  },
  AUD: {
    symbol: '$',
    name: 'Australian Dollar',
    locale: 'en-AU',
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const LoanCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currency, setCurrency] = useState('AUD');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState('');
  const [errors, setErrors] = useState({});
  const [showDetailedTable, setShowDetailedTable] = useState(true);

  const formatCurrency = (value, currency) => {
    if (!value) return '';
    return new Intl.NumberFormat(currencyConfig[currency].locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      newErrors.loanAmount = 'Please enter a valid loan amount';
    }
    if (!interestRate || parseFloat(interestRate) <= 0) {
      newErrors.interestRate = 'Please enter a valid interest rate';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLoan = () => {
    if (!validateInputs()) return null;

    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
    };
  };

  const results = useMemo(() => calculateLoan(), [loanAmount, loanTerm, interestRate]);

  const generateChartData = () => {
    if (!results) return null;

    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = results.monthlyPayment;

    let remainingBalance = principal;
    const balanceData = [];
    const principalData = [];
    const interestData = [];
    const cumulativePrincipalData = [];
    const cumulativeInterestData = [];
    
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let month = 0; month <= numberOfPayments; month += 12) {
      balanceData.push(remainingBalance);
      
      const yearlyInterest = remainingBalance * (monthlyRate * 12);
      const yearlyPrincipal = (monthlyPayment * 12) - yearlyInterest;
      
      totalPrincipalPaid += yearlyPrincipal;
      totalInterestPaid += yearlyInterest;
      
      principalData.push(yearlyPrincipal);
      interestData.push(yearlyInterest);
      cumulativePrincipalData.push(totalPrincipalPaid);
      cumulativeInterestData.push(totalInterestPaid);
      
      remainingBalance -= yearlyPrincipal;
    }

    return {
      labels: Array.from({ length: loanTerm + 1 }, (_, i) => `Year ${i}`),
      datasets: [
        {
          label: 'Remaining Balance',
          data: balanceData,
          borderColor: theme.palette.grey[600],
          fill: false,
          order: 5,
        },
        {
          label: 'Yearly Principal Payment',
          data: principalData,
          borderColor: theme.palette.success.light,
          fill: false,
          borderDash: [5, 5],
          order: 4,
        },
        {
          label: 'Yearly Interest Payment',
          data: interestData,
          borderColor: theme.palette.error.light,
          fill: false,
          borderDash: [5, 5],
          order: 3,
        },
        {
          label: 'Total Principal Paid',
          data: cumulativePrincipalData,
          borderColor: theme.palette.success.dark,
          fill: false,
          borderWidth: 3,
          order: 2,
        },
        {
          label: 'Total Interest Paid',
          data: cumulativeInterestData,
          borderColor: theme.palette.error.dark,
          fill: false,
          borderWidth: 3,
          order: 1,
        },
      ],
    };
  };

  const chartData = useMemo(() => generateChartData(), [results, theme.palette]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: 'Loan Amortization Schedule',
        padding: 20,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y, currency);
              // Add percentage for cumulative values
              if (label.includes('Total') && results) {
                const percentage = (context.parsed.y / (results.totalPayment)) * 100;
                label += ` (${percentage.toFixed(1)}% of total)`;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value, currency),
        },
        grid: {
          color: theme.palette.grey[200],
        }
      },
      x: {
        grid: {
          color: theme.palette.grey[200],
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Loan Calculator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    label="Currency"
                  >
                    {Object.entries(currencyConfig).map(([code, config]) => (
                      <MenuItem key={code} value={code}>
                        {config.symbol} {config.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Loan Amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  error={!!errors.loanAmount}
                  helperText={errors.loanAmount}
                  InputProps={{
                    startAdornment: currencyConfig[currency].symbol,
                  }}
                />
                <Tooltip title={tooltipTexts.loanAmount}>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Loan Term (Years): {loanTerm}</Typography>
                <Slider
                  value={loanTerm}
                  onChange={(_, newValue) => setLoanTerm(newValue)}
                  min={1}
                  max={30}
                  marks
                  valueLabelDisplay="auto"
                />
                <Tooltip title={tooltipTexts.loanTerm}>
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value.replace(/[^\d.]/g, ''))}
                  error={!!errors.interestRate}
                  helperText={errors.interestRate}
                  InputProps={{
                    endAdornment: '%',
                  }}
                />
                <Tooltip title={tooltipTexts.interestRate}>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loan Summary
            </Typography>
            {results && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    Monthly Payment: {formatCurrency(results.monthlyPayment, currency)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Total Interest: {formatCurrency(results.totalInterest, currency)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Total Payment: {formatCurrency(results.totalPayment, currency)}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ height: isMobile ? 300 : 400 }}>
              {chartData && <Line data={chartData} options={chartOptions} />}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: '100%', mb: 2 }}>
            <Button
              onClick={() => setShowDetailedTable(!showDetailedTable)}
              endIcon={showDetailedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              variant="outlined"
              fullWidth
              aria-expanded={showDetailedTable}
              aria-controls="yearly-breakdown-table"
            >
              {showDetailedTable ? 'Hide' : 'Show'} Detailed Yearly Breakdown
            </Button>
          </Box>
          
          <Collapse in={showDetailedTable} timeout="auto">
            <TableContainer 
              component={Paper} 
              elevation={3}
              sx={{
                maxHeight: 440,
                overflow: 'auto',
                '& .MuiTableCell-root': {
                  px: { xs: 1, sm: 2 },
                  py: 1.5,
                  whiteSpace: 'nowrap'
                }
              }}
              id="yearly-breakdown-table"
              role="region"
              aria-label="Yearly loan breakdown table"
            >
              <Box sx={{ 
                minWidth: { xs: 'max-content', md: '100%' },
                overflowX: { xs: 'auto', md: 'hidden' }
              }}>
                <Table 
                  stickyHeader 
                  size={isMobile ? "small" : "medium"}
                  sx={{ minWidth: 650 }}
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Year</StyledTableCell>
                      <StyledTableCell align="right">Remaining Balance</StyledTableCell>
                      <StyledTableCell align="right">Yearly Principal</StyledTableCell>
                      <StyledTableCell align="right">Yearly Interest</StyledTableCell>
                      <StyledTableCell align="right">Total Principal Paid</StyledTableCell>
                      <StyledTableCell align="right">Total Interest Paid</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chartData?.datasets[0].data.map((_, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          Year {index}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {formatCurrency(chartData.datasets[0].data[index], currency)}
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ color: theme.palette.success.main }}>
                          {formatCurrency(chartData.datasets[1].data[index], currency)}
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ color: theme.palette.error.main }}>
                          {formatCurrency(chartData.datasets[2].data[index], currency)}
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ color: theme.palette.success.dark }}>
                          {formatCurrency(chartData.datasets[3].data[index], currency)}
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{ color: theme.palette.error.dark }}>
                          {formatCurrency(chartData.datasets[4].data[index], currency)}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    {results && (
                      <StyledTableRow>
                        <StyledTableCell 
                          component="th" 
                          scope="row"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[100]
                          }}
                        >
                          Totals
                        </StyledTableCell>
                        <StyledTableCell 
                          align="right"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[100]
                          }}
                        >
                          {formatCurrency(0, currency)}
                        </StyledTableCell>
                        <StyledTableCell 
                          align="right"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.success.main
                          }}
                        >
                          {formatCurrency(results.totalPayment - results.totalInterest, currency)}
                        </StyledTableCell>
                        <StyledTableCell 
                          align="right"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.error.main
                          }}
                        >
                          {formatCurrency(results.totalInterest, currency)}
                        </StyledTableCell>
                        <StyledTableCell 
                          align="right"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.success.dark
                          }}
                        >
                          {formatCurrency(results.totalPayment - results.totalInterest, currency)}
                        </StyledTableCell>
                        <StyledTableCell 
                          align="right"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.error.dark
                          }}
                        >
                          {formatCurrency(results.totalInterest, currency)}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanCalculator;