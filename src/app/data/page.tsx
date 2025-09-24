"use client"

import { useState, useEffect } from "react"
import GHLWidget from "@/components/GHLWidget"
import { 
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  PhoneIcon,
  ChartPieIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline"

type AccountStatus = "Cancelled" | "Active" | "Unknown"

export default function ClientDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [showAllData, setShowAllData] = useState(false)
  const [airtableData, setAirtableData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // New state for dashboard features
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [leadSearchTerm, setLeadSearchTerm] = useState('')
  const [leadFilter, setLeadFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [showLeadDatabase, setShowLeadDatabase] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "patKFVFgoOker2N6a.1bcdfa9c1c760b378d785a721662f2b1be4be43677336209a76c6f4696f8fcf2"
        const baseId = "appKrDCCamzI89g7i"
        const tableName = "Clients"
        const campaignName = "Adam Ecker"

        const formula = `TRIM({Campaign's Name (Trimmed)})="${campaignName}"`
        const encodedFormula = encodeURIComponent(formula)

        const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodedFormula}`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        const data = await response.json()
        
        setAirtableData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 flex items-center justify-center p-8">
        <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-cyan-400 font-mono text-sm tracking-wider">LOADING DATA...</div>
        </div>
      </div>
    )
  }

  if (!airtableData?.records || airtableData.records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 flex items-center justify-center p-8">
        <div className="bg-slate-800/50 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-red-400 font-mono text-sm tracking-wider">ERROR: NO RECORDS FOUND</div>
        </div>
      </div>
    )
  }

  const record = airtableData.records[0]
  const fields = record.fields

  // Debug: Log the actual fields returned from Airtable (remove in production)
  console.log("Airtable fields:", Object.keys(fields))
  console.log("Sample field values:", {
    "Account Status": fields["Account Status"],
    "Campaign's Name (Trimmed)": fields["Campaign's Name (Trimmed)"],
    "Name": fields["Name"],
    "Calls YTD": fields["Calls YTD"],
    "Connects YTD": fields["Connects YTD"],
    "Leads YTD": fields["Leads YTD"]
  })

  // Helper function to safely get numeric values
  const getNumericValue = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[,$%]/g, ''))
      return isNaN(parsed) ? defaultValue : parsed
    }
    // Handle error objects and special values
    if (value && typeof value === 'object') {
      if (value.error) return defaultValue
      if (value.specialValue === 'NaN') return defaultValue
    }
    return defaultValue
  }

  // Helper function to safely get string values
  const getStringValue = (value: any, defaultValue: string = "N/A"): string => {
    if (value === null || value === undefined) return defaultValue
    // Handle error objects and special values
    if (value && typeof value === 'object') {
      if (value.error) return defaultValue
      if (value.specialValue === 'NaN') return defaultValue
      return defaultValue
    }
    return String(value).trim() || defaultValue
  }

  // Helper function to calculate percentage
  const calculatePercentage = (numerator: number, denominator: number): string => {
    if (denominator === 0) return "0%"
    return `${Math.round((numerator / denominator) * 100)}%`
  }

  // Mock data for comprehensive dashboard features - using stable seed for consistent SSR/CSR
  const generateMockDailyData = () => {
    const data = []
    const today = new Date()
    // Use a fixed seed for consistent data generation
    let seed = 12345
    
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      if (date.getDay() >= 1 && date.getDay() <= 5) { // Monday to Friday only
        data.push({
          date: date.toISOString().split('T')[0],
          calls: Math.floor(seededRandom() * 200) + 100,
          connects: Math.floor(seededRandom() * 50) + 20,
          leads: Math.floor(seededRandom() * 15) + 5,
          hotLeads: Math.floor(seededRandom() * 8) + 2,
          warmLeads: Math.floor(seededRandom() * 5) + 1,
          coldLeads: Math.floor(seededRandom() * 3) + 1,
          leadNotes: `Day ${30-i} performance notes`,
          commentary: `Strong performance on ${date.toLocaleDateString()}`
        })
      }
    }
    return data
  }

  const generateMockLeads = () => {
    const leads = []
    const names = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'David Brown', 'Emma Taylor', 'Chris Anderson', 'Maria Garcia']
    const addresses = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm St', '654 Maple Dr', '987 Cedar Ln', '147 Birch Way', '258 Spruce Ct']
    const temperatures = ['Hot', 'Warm', 'Cold']
    const statuses = ['New', 'In Progress', 'Closed']
    
    // Use a fixed seed for consistent data generation
    let seed = 54321
    
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    for (let i = 0; i < 50; i++) {
      const baseDate = new Date('2024-01-01')
      baseDate.setDate(baseDate.getDate() + Math.floor(seededRandom() * 365))
      
      leads.push({
        id: i + 1,
        dateGenerated: baseDate.toISOString().split('T')[0],
        ownerName: names[Math.floor(seededRandom() * names.length)],
        phoneNumber: `(555) ${Math.floor(seededRandom() * 900) + 100}-${Math.floor(seededRandom() * 9000) + 1000}`,
        propertyAddress: addresses[Math.floor(seededRandom() * addresses.length)],
        leadNotes: `Lead notes for ${names[Math.floor(seededRandom() * names.length)]}`,
        temperature: temperatures[Math.floor(seededRandom() * temperatures.length)],
        status: statuses[Math.floor(seededRandom() * statuses.length)]
      })
    }
    return leads
  }

  // Generate data only on client side to prevent hydration issues
  const [dailyData, setDailyData] = useState<any[]>([])
  const [mockLeads, setMockLeads] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setDailyData(generateMockDailyData())
    setMockLeads(generateMockLeads())
  }, [])

  // Helper function to safely get percentage values
  const getPercentageValue = (value: any, defaultValue: string = "0%"): string => {
    if (value === null || value === undefined) return defaultValue
    // Handle error objects and special values
    if (value && typeof value === 'object') {
      if (value.error) return defaultValue
      if (value.specialValue === 'NaN') return defaultValue
      return defaultValue
    }
    if (typeof value === 'number') {
      return `${value}%`
    }
    if (typeof value === 'string') {
      const cleanValue = value.replace(/[%]/g, '')
      const parsed = parseFloat(cleanValue)
      return isNaN(parsed) ? defaultValue : `${parsed}%`
    }
    return defaultValue
  }

  // Extract and process data from Airtable fields
  const performanceData = {
    // Key Performance Metrics
    totalCalls: getNumericValue(fields["Calls YTD"]),
    totalConnects: getNumericValue(fields["Connects YTD"]),
    connectRate: getPercentageValue(fields["Connect Rate"]),
    leadsGenerated: getNumericValue(fields["Leads YTD"]),
    leadConversionRate: getPercentageValue(fields["Lead Conversion Rate"]),
    
    // Financial Data
    totalRevenue: getStringValue(fields["Total Cost"]) ? "$" + getNumericValue(fields["Total Cost"]).toLocaleString() : "N/A",
    monthlyRevenue: "N/A", // Not available in this dataset
    costPerLead: "N/A", // Not available in this dataset
    totalCost: getStringValue(fields["Total Cost"]) ? "$" + getNumericValue(fields["Total Cost"]).toLocaleString() : "N/A",
    
    // Monthly Performance
    mtdLeads: getNumericValue(fields["MTD Leads"]),
    mtdTarget: getNumericValue(fields["MTD Target"]),
    mtdAchievement: getPercentageValue(fields["MTD Achievement"]),
    m1Leads: getNumericValue(fields["M-1 Leads"]),
    m1Achievement: getPercentageValue(fields["M-1 Achievement"]),
    m2Leads: getNumericValue(fields["M-2 Leads"]),
    m2Achievement: getPercentageValue(fields["M-2 Achievement"]),
    m3Leads: getNumericValue(fields["M-3 Leads"]),
    m3Achievement: getPercentageValue(fields["M-3 Achievement"]),
    q1Leads: getNumericValue(fields["Q-1 Leads"]),
    q1Achievement: getPercentageValue(fields["Q-1 Achievement"]),
    q1Status: getStringValue(fields["Achieved [Q-1]"]),
    
    // Additional Metrics
    activeDays: getNumericValue(fields["MTD Active Days"]),
    workingDays: getNumericValue(fields["Current Cycle Active Days"]),
    totalRecords: getNumericValue(fields["Total Records Uploaded [All Time]"]),
    consumedRecords: getNumericValue(fields["Consumed Records"]),
    listHealth: getPercentageValue(fields["List Health %"]),
    dailyTarget: getNumericValue(fields["Daily Target"]),
    dailyAchievement: getPercentageValue(fields["Daily Achievement"])
  }

  const additionalMetrics = {
    // Call Disposition Data
    callbacks: getNumericValue(fields["W-1 Call Back"]),
    dnc: getNumericValue(fields["W-1 DNC"]),
    notInterested: getNumericValue(fields["W-1 Not Interested"]),
    notAvailable: getNumericValue(fields["W-1 Not Available"]),
    voicemail: getNumericValue(fields["W-1 Voicemail"]),
    wrongNumber: getNumericValue(fields["W-1 Wrong Number"]),
    spanishSpeaker: getNumericValue(fields["W-1 Spanish Speaker"]),
    silentCall: getNumericValue(fields["W-1 Silent Call"]),
    
    // Lead Quality Data
    hotLeads: getNumericValue(fields["MTD Hot"]),
    warmLeads: getNumericValue(fields["Warm | MTD"]),
    coldLeads: getNumericValue(fields["MTD Cold"]),
    qualifiedLeads: getNumericValue(fields["Leads YTD"]), // Using total leads as qualified
    
    // System Metrics
    totalCallsYTD: getNumericValue(fields["Calls YTD"]),
    connectsYTD: getNumericValue(fields["Connects YTD"]),
    leadsYTD: getNumericValue(fields["Leads YTD"]),
    connectRateYTD: getPercentageValue(fields["Connect Rate"]),
    leadConversionRateYTD: getPercentageValue(fields["Lead Conversion Rate"]),
    
    // Client Activity
    activeClients: 1, // This is a single client record
    newClientsThisMonth: getStringValue(fields["New Clients | WTD"]) === "Yes" ? 1 : 0,
    cancelledThisMonth: getStringValue(fields["Cancelled this month?"]) === "Yes" ? 1 : 0,
    trialSeats: getNumericValue(fields["Trial Seats NO"]),
    
    // Meeting Data
    meetingsMTD: getNumericValue(fields["Meetings MTD"]),
    meetingsTarget: getNumericValue(fields["MTD Meeting Target"]),
    meetingsAchieved: getNumericValue(fields["MTD Total Approved"]),
    
    // List Management
    listCost: getStringValue(fields["Total Cost"]) ? "$" + getNumericValue(fields["Total Cost"]).toLocaleString() : "N/A",
    totalListCost: getStringValue(fields["Total Cost"]) ? "$" + getNumericValue(fields["Total Cost"]).toLocaleString() : "N/A",
    recordsUploaded: getNumericValue(fields["MTD Records Uploaded"]),
    listDueDate: getStringValue(fields["List Due?"]),
    listHealth: getPercentageValue(fields["List Health %"])
  }

  const handleCancel = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Account cancellation request submitted successfully!")
    }, 2000)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const apiKey = "patKFVFgoOker2N6a.1bcdfa9c1c760b378d785a721662f2b1be4be43677336209a76c6f4696f8fcf2"
      const baseId = "appKrDCCamzI89g7i"
      const tableName = "Clients"
      const campaignName = "Adam Ali"

      const formula = `TRIM({Campaign's Name (Trimmed)})="${campaignName}"`
      const encodedFormula = encodeURIComponent(formula)

      const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodedFormula}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      const data = await response.json()
      setAirtableData(data)
      alert("Data refreshed successfully!")
    } catch (error) {
      console.error("Error refreshing data:", error)
      alert("Error refreshing data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    setIsLoading(true)
    
    // Create CSV data
    const csvData = [
      ["Metric", "Value"],
      ["Total Calls", performanceData.totalCalls],
      ["Total Connects", performanceData.totalConnects],
      ["Connect Rate", performanceData.connectRate],
      ["Leads Generated", performanceData.leadsGenerated],
      ["Lead Conversion Rate", performanceData.leadConversionRate],
      ["Total Revenue", performanceData.totalRevenue],
      ["Monthly Revenue", performanceData.monthlyRevenue],
      ["Cost Per Lead", performanceData.costPerLead],
      ["Total Cost", performanceData.totalCost],
      ["MTD Leads", performanceData.mtdLeads],
      ["MTD Achievement", performanceData.mtdAchievement],
      ["M-1 Achievement", performanceData.m1Achievement],
      ["M-2 Achievement", performanceData.m2Achievement],
      ["M-3 Achievement", performanceData.m3Achievement],
      ["Q-1 Leads", performanceData.q1Leads],
      ["Q-1 Achievement", performanceData.q1Achievement],
      ["Q-1 Status", performanceData.q1Status],
      ["Callbacks", additionalMetrics.callbacks],
      ["DNC", additionalMetrics.dnc],
      ["Not Interested", additionalMetrics.notInterested],
      ["Voicemail", additionalMetrics.voicemail],
      ["Wrong Number", additionalMetrics.wrongNumber],
      ["Hot Leads", additionalMetrics.hotLeads],
      ["Warm Leads", additionalMetrics.warmLeads],
      ["Cold Leads", additionalMetrics.coldLeads],
      ["Qualified Leads", additionalMetrics.qualifiedLeads],
      ["Total Calls YTD", additionalMetrics.totalCallsYTD],
      ["Connects YTD", additionalMetrics.connectsYTD],
      ["Leads YTD", additionalMetrics.leadsYTD],
      ["Connect Rate YTD", additionalMetrics.connectRateYTD],
      ["Lead Conversion YTD", additionalMetrics.leadConversionRateYTD],
      ["Active Clients", additionalMetrics.activeClients],
      ["New Clients This Month", additionalMetrics.newClientsThisMonth],
      ["Cancelled This Month", additionalMetrics.cancelledThisMonth],
      ["Trial Seats", additionalMetrics.trialSeats],
      ["Meetings MTD", additionalMetrics.meetingsMTD]
    ]
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")
    
    // Create and download file
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `adsumo-data-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setIsLoading(false)
  }
  const handlePrint = () => {
    setIsLoading(true)
    
    // Create a print-friendly version
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Adsumo Client Dashboard - Print</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 25px; page-break-inside: avoid; }
              .metric { display: flex; justify-content: space-between; margin: 5px 0; padding: 5px; border-bottom: 1px solid #eee; }
              .metric-label { font-weight: bold; }
              .metric-value { color: #333; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Adsumo Client Dashboard</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Key Performance Metrics</div>
              <div class="metric"><span class="metric-label">Total Calls:</span><span class="metric-value">${performanceData.totalCalls.toLocaleString()}</span></div>
              <div class="metric"><span class="metric-label">Total Connects:</span><span class="metric-value">${performanceData.totalConnects.toLocaleString()}</span></div>
              <div class="metric"><span class="metric-label">Connect Rate:</span><span class="metric-value">${performanceData.connectRate}</span></div>
              <div class="metric"><span class="metric-label">Leads Generated:</span><span class="metric-value">${performanceData.leadsGenerated}</span></div>
              <div class="metric"><span class="metric-label">Lead Conversion Rate:</span><span class="metric-value">${performanceData.leadConversionRate}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">Financial Overview</div>
              <div class="metric"><span class="metric-label">Total Revenue:</span><span class="metric-value">${performanceData.totalRevenue}</span></div>
              <div class="metric"><span class="metric-label">Monthly Revenue:</span><span class="metric-value">${performanceData.monthlyRevenue}</span></div>
              <div class="metric"><span class="metric-label">Cost Per Lead:</span><span class="metric-value">${performanceData.costPerLead}</span></div>
              <div class="metric"><span class="metric-label">Total Cost:</span><span class="metric-value">${performanceData.totalCost}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">Monthly Performance</div>
              <div class="metric"><span class="metric-label">MTD Leads:</span><span class="metric-value">${performanceData.mtdLeads}</span></div>
              <div class="metric"><span class="metric-label">MTD Achievement:</span><span class="metric-value">${performanceData.mtdAchievement}</span></div>
              <div class="metric"><span class="metric-label">M-1 Achievement:</span><span class="metric-value">${performanceData.m1Achievement}</span></div>
              <div class="metric"><span class="metric-label">M-2 Achievement:</span><span class="metric-value">${performanceData.m2Achievement}</span></div>
              <div class="metric"><span class="metric-label">M-3 Achievement:</span><span class="metric-value">${performanceData.m3Achievement}</span></div>
              <div class="metric"><span class="metric-label">Q-1 Leads:</span><span class="metric-value">${performanceData.q1Leads}</span></div>
              <div class="metric"><span class="metric-label">Q-1 Achievement:</span><span class="metric-value">${performanceData.q1Achievement}</span></div>
              <div class="metric"><span class="metric-label">Q-1 Status:</span><span class="metric-value">${performanceData.q1Status}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">Call Disposition</div>
              <div class="metric"><span class="metric-label">Callbacks:</span><span class="metric-value">${additionalMetrics.callbacks}</span></div>
              <div class="metric"><span class="metric-label">DNC:</span><span class="metric-value">${additionalMetrics.dnc}</span></div>
              <div class="metric"><span class="metric-label">Not Interested:</span><span class="metric-value">${additionalMetrics.notInterested}</span></div>
              <div class="metric"><span class="metric-label">Voicemail:</span><span class="metric-value">${additionalMetrics.voicemail}</span></div>
              <div class="metric"><span class="metric-label">Wrong Number:</span><span class="metric-value">${additionalMetrics.wrongNumber}</span></div>
            </div>
            
            <div class="section">
              <div class="section-title">Lead Quality</div>
              <div class="metric"><span class="metric-label">Hot Leads:</span><span class="metric-value">${additionalMetrics.hotLeads}</span></div>
              <div class="metric"><span class="metric-label">Warm Leads:</span><span class="metric-value">${additionalMetrics.warmLeads}</span></div>
              <div class="metric"><span class="metric-label">Cold Leads:</span><span class="metric-value">${additionalMetrics.coldLeads}</span></div>
              <div class="metric"><span class="metric-label">Qualified Leads:</span><span class="metric-value">${additionalMetrics.qualifiedLeads}</span></div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
    
    setIsLoading(false)
  }

  // Get status from Airtable
  const status = getStringValue(fields["Account Status"], "Unknown")
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/30"
      default:
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 relative overflow-hidden">
      {/* Professional Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-r from-blue-500/8 to-cyan-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[36rem] h-[36rem] bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative z-10 p-4 md:p-8">
        {/* 1. Dashboard Header & Brand Strip */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-2xl border border-slate-600/50 p-6 md:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Brand Section */}
            <div className="flex items-center gap-6">
                {/* No Accent Callers Logo Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">NAC</span>
                  </div>
                </div>
              
              <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    No Accent Callers
                </h1>
                  <p className="text-slate-400 text-sm md:text-base">
                    Scaling your pipeline through elite offshore calling teams.
                  </p>
              </div>
            </div>
            
              {/* Campaign Info Card */}
              <div className="bg-slate-700/50 rounded-xl p-4 md:p-6 border border-slate-600/50 min-w-[280px]">
                <h3 className="text-slate-300 font-semibold mb-4 text-sm md:text-base">CAMPAIGN INFO</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client:</span>
                    <span className="text-cyan-400 font-medium">{getStringValue(fields["Name"])}</span>
              </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Market:</span>
                    <span className="text-blue-400 font-medium">{getStringValue(fields["Industry"])}</span>
              </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Callers:</span>
                    <span className="text-green-400 font-medium">{getNumericValue(fields["Number of seats"])}</span>
            </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="text-purple-400 font-medium">{getStringValue(fields["Start date [Dialing]"])}</span>
          </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned CSM:</span>
                    <span className="text-amber-400 font-medium">{getStringValue(fields["CSM's Name"])}</span>
        </div>
            </div>
              </div>
              </div>
              </div>
              </div>


        {/* 2. Campaign Overview Toggle (Daily EOD View) */}
        <div className="mb-8">
          <div className="bg-slate-800/60 rounded-2xl border border-slate-600/50 p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
                Daily Campaign Overview
              </h2>
              <div className="flex gap-2">
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 text-sm"
                />
            </div>
          </div>

            {/* EOD Data Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {isClient ? (dailyData[dailyData.length - 1]?.calls || 0) : '...'}
                </div>
                <div className="text-sm text-slate-400">Calls</div>
            </div>
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {isClient ? (dailyData[dailyData.length - 1]?.connects || 0) : '...'}
                </div>
                <div className="text-sm text-slate-400">Connects</div>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {isClient ? (dailyData[dailyData.length - 1]?.leads || 0) : '...'}
                </div>
                <div className="text-sm text-slate-400">Leads</div>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {isClient ? (dailyData[dailyData.length - 1]?.hotLeads || 0) : '...'}
                </div>
                <div className="text-sm text-slate-400">Hot Leads</div>
              </div>
              </div>
            
            <div className="mt-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="text-sm text-slate-400 mb-2">Lead Notes & Commentary:</div>
              <div className="text-slate-300">
                {isClient ? (dailyData[dailyData.length - 1]?.commentary || "No commentary available") : "Loading..."}
              </div>
            </div>
          </div>
        </div>

        {/* 3. KPI Snapshot Tables */}
        <div className="mb-8">
          <div className="bg-slate-800/60 rounded-2xl border border-slate-600/50 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <TableCellsIcon className="w-6 h-6 text-green-400" />
              KPI Performance Tables
            </h2>
            
            {/* Table Toggle */}
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setSelectedTimeframe('daily')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeframe === 'daily' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Daily
              </button>
              <button 
                onClick={() => setSelectedTimeframe('weekly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeframe === 'weekly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setSelectedTimeframe('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeframe === 'monthly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* KPI Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600/50">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Calls</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Connects</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Hot Leads</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Warm Leads</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Cold Leads</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Total Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {isClient ? dailyData.slice(-10).map((day, index) => (
                    <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-slate-300">{new Date(day.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right text-cyan-400 font-medium">{day.calls}</td>
                      <td className="py-3 px-4 text-right text-blue-400 font-medium">{day.connects}</td>
                      <td className="py-3 px-4 text-right text-red-400 font-medium">{day.hotLeads}</td>
                      <td className="py-3 px-4 text-right text-yellow-400 font-medium">{day.warmLeads}</td>
                      <td className="py-3 px-4 text-right text-blue-400 font-medium">{day.coldLeads}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-medium">{day.leads}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-slate-400">Loading data...</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
              </div>
              </div>

        {/* 4. KPI Visual Dashboard */}
        <div className="mb-8">
          <div className="bg-slate-800/60 rounded-2xl border border-slate-600/50 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-purple-400" />
              Interactive Performance Dashboard
            </h2>
            
            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Daily Performance Chart */}
              <div className="bg-slate-700/40 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Daily Performance Trends</h3>
                <div className="h-64 flex items-end justify-between gap-1">
                  {isClient ? dailyData.slice(-14).map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t" 
                           style={{ height: `${(day.calls / 300) * 200}px` }}></div>
                      <div className="text-xs text-slate-400">{new Date(day.date).getDate()}</div>
              </div>
                  )) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Loading chart data...
                    </div>
                  )}
              </div>
                <div className="mt-4 text-sm text-slate-400">Calls per Day (Last 14 Days)</div>
              </div>

              {/* Lead Temperature Breakdown */}
              <div className="bg-slate-700/40 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Lead Temperature Distribution</h3>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    {/* Pie Chart Simulation */}
                    <div className="absolute inset-0 rounded-full border-8 border-red-500" 
                         style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)' }}></div>
                    <div className="absolute inset-0 rounded-full border-8 border-yellow-500" 
                         style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)' }}></div>
                    <div className="absolute inset-0 rounded-full border-8 border-blue-500" 
                         style={{ clipPath: 'polygon(50% 50%, 100% 50%, 50% 100%)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-300">
                          {isClient ? dailyData.reduce((sum, day) => sum + day.leads, 0) : '...'}
                        </div>
                        <div className="text-sm text-slate-400">Total Leads</div>
              </div>
              </div>
            </div>
          </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-slate-400">Hot</span>
            </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-slate-400">Warm</span>
              </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-400">Cold</span>
              </div>
              </div>
            </div>
          </div>

            {/* Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {isClient ? calculatePercentage(dailyData[dailyData.length - 1]?.connects || 0, dailyData[dailyData.length - 1]?.calls || 1) : '...'}
            </div>
                <div className="text-sm text-slate-400">Connect Rate</div>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {isClient ? calculatePercentage(dailyData[dailyData.length - 1]?.leads || 0, dailyData[dailyData.length - 1]?.connects || 1) : '...'}
              </div>
                <div className="text-sm text-slate-400">Lead Conversion Rate</div>
              </div>
              <div className="bg-slate-700/40 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {isClient ? calculatePercentage(dailyData[dailyData.length - 1]?.leads || 0, dailyData[dailyData.length - 1]?.calls || 1) : '...'}
                </div>
                <div className="text-sm text-slate-400">Raw Lead Rate</div>
              </div>
            </div>
          </div>
        </div>


        {/* 5. Lead Database Table */}
        <div className="mb-8">
          <div className="bg-slate-800/60 rounded-2xl border border-slate-600/50 p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-orange-400" />
                Lead Database
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLeadDatabase(!showLeadDatabase)}
                  className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-orange-400 text-sm transition-all duration-200"
                >
                  {showLeadDatabase ? 'Hide Database' : 'Show Database'}
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export CSV
                </button>
            </div>
          </div>

            {showLeadDatabase && (
              <>
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by owner name or property address..."
                      value={leadSearchTerm}
                      onChange={(e) => setLeadSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                    />
              </div>
                  <div className="flex gap-2">
                    <select
                      value={leadFilter}
                      onChange={(e) => setLeadFilter(e.target.value as 'all' | 'hot' | 'warm' | 'cold')}
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 text-sm"
                    >
                      <option value="all">All Leads</option>
                      <option value="hot">Hot Leads</option>
                      <option value="warm">Warm Leads</option>
                      <option value="cold">Cold Leads</option>
                    </select>
                    <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-300 text-sm transition-all duration-200 flex items-center gap-2">
                      <FunnelIcon className="w-4 h-4" />
                      Filters
                    </button>
            </div>
          </div>

                {/* Lead Database Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600/50">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Date Generated</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Owner Name</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Phone Number</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Property Address</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Lead Notes</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Temperature</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isClient ? mockLeads
                        .filter(lead => {
                          const matchesSearch = lead.ownerName.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                                              lead.propertyAddress.toLowerCase().includes(leadSearchTerm.toLowerCase())
                          const matchesFilter = leadFilter === 'all' || lead.temperature.toLowerCase() === leadFilter
                          return matchesSearch && matchesFilter
                        })
                        .slice(0, 20)
                        .map((lead) => (
                        <tr key={lead.id} className="border-b border-slate-700/30 hover:bg-slate-700/30">
                          <td className="py-3 px-4 text-slate-300">{new Date(lead.dateGenerated).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-cyan-400 font-medium">{lead.ownerName}</td>
                          <td className="py-3 px-4 text-blue-400 font-medium">{lead.phoneNumber}</td>
                          <td className="py-3 px-4 text-slate-300">{lead.propertyAddress}</td>
                          <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{lead.leadNotes}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.temperature === 'Hot' ? 'bg-red-500/20 text-red-400' :
                              lead.temperature === 'Warm' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {lead.temperature}
                </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.status === 'New' ? 'bg-green-500/20 text-green-400' :
                              lead.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="py-8 px-4 text-center text-slate-400">Loading lead data...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
              </div>
                
                <div className="mt-4 text-sm text-slate-400 text-center">
                  {isClient ? `Showing ${Math.min(20, mockLeads.filter(lead => {
                    const matchesSearch = lead.ownerName.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                                        lead.propertyAddress.toLowerCase().includes(leadSearchTerm.toLowerCase())
                    const matchesFilter = leadFilter === 'all' || lead.temperature.toLowerCase() === leadFilter
                    return matchesSearch && matchesFilter
                  }).length)} of ${mockLeads.length} leads` : 'Loading lead count...'}
              </div>
              </>
            )}
              </div>
              </div>

        {/* CSM Details Section */}
        <div className="mb-8">
          <div className="bg-slate-800/60 rounded-2xl border border-slate-600/50 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <UserGroupIcon className="w-6 h-6 text-cyan-400" />
              Your Dedicated CSM Team
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary CSM */}
              <div className="bg-slate-700/40 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {getStringValue(fields["CSM's Name"]).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200">{getStringValue(fields["CSM's Name"])}</h3>
                    <p className="text-sm text-slate-400">{getStringValue(fields["Role (from CSMs Bio)"])}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Email</span>
                    <span className="text-cyan-400 font-medium text-sm">{getStringValue(fields["Email (from CSMs Bio)"])}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Phone</span>
                    <span className="text-blue-400 font-medium text-sm">{getStringValue(fields["Phone (from CSMs Bio)"])}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Status</span>
                    <span className="text-green-400 font-medium text-sm">{getStringValue(fields["Status (from CSMs Bio)"])}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Experience</span>
                    <span className="text-yellow-400 font-medium text-sm">{getStringValue(fields["Experience (from CSMs Bio)"])}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Specialization</span>
                    <span className="text-purple-400 font-medium text-sm">{getStringValue(fields["Specialization (from CSMs Bio)"])}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Time Zone</span>
                    <span className="text-indigo-400 font-medium text-sm">{getStringValue(fields["Time Zone (from CSMs Bio)"])}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-600/30 rounded-lg">
                    <span className="text-slate-300 text-sm">Availability</span>
                    <span className="text-emerald-400 font-medium text-sm">{getStringValue(fields["Availability (from CSMs Bio)"])}</span>
                  </div>
                </div>
                
                {/* CSM Contact Actions */}
                <div className="mt-6 pt-4 border-t border-slate-600/30">
                  <div className="text-xs text-slate-400 mb-3 font-mono tracking-wider">QUICK ACTIONS</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs font-medium transition-all duration-200">
                      Email CSM
                    </button>
                    <button className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-medium transition-all duration-200">
                      Schedule Call
                    </button>
                    <button className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-medium transition-all duration-200">
                      View Profile
                    </button>
                    <button className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-medium transition-all duration-200">
                      View Reports
                    </button>
                  </div>
                </div>
              </div>

              {/* CSM Performance & Availability */}
              <div className="bg-slate-700/40 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">CSM Performance & Availability</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-600/30 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Current Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">{getStringValue(fields["Status (from CSMs Bio)"])}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Availability</div>
                    <div className="text-slate-300 text-sm">{getStringValue(fields["Availability (from CSMs Bio)"])}</div>
                  </div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Experience Level</div>
                    <div className="text-cyan-400 font-medium">{getStringValue(fields["Experience (from CSMs Bio)"])}</div>
                  </div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Specialization</div>
                    <div className="text-yellow-400 font-medium">{getStringValue(fields["Specialization (from CSMs Bio)"])}</div>
                  </div>
                  
                  <div className="p-4 bg-slate-600/30 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Time Zone</div>
                    <div className="text-slate-300 text-sm">{getStringValue(fields["Time Zone (from CSMs Bio)"])}</div>
                  </div>
                </div>
                
                {/* CSM Notes */}
                <div className="mt-6 pt-4 border-t border-slate-600/30">
                  <div className="text-sm text-slate-400 mb-2">CSM Bio Notes</div>
                  <div className="text-slate-300 text-sm bg-slate-600/20 p-3 rounded-lg">
                    {getStringValue(fields["Bio (from CSMs Bio)"])}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 rounded-lg text-slate-300 font-medium transition-all duration-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            onClick={handlePrint}
            disabled={isLoading}
            className="px-6 py-3 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 rounded-lg text-amber-400 font-medium transition-all duration-200 disabled:opacity-50"
          >
            Print Report
          </button>
        </div>
      </div>

      {/* Floating GHL Chat Widget - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <GHLWidget />
      </div>
    </div>
  )
}

