<template>
  <div class="bg-[#f9f9ff] rounded-xl sm:rounded-2xl p-3 sm:p-6 overflow-visible">
    <div class="flex items-center justify-between mb-2 sm:mb-4">
      <h3 class="font-poppins font-bold text-base sm:text-xl text-ditto-text">Performance Data</h3>
    </div>
    
    <div class="h-[180px] sm:h-[320px] relative overflow-visible">
      <Line ref="chartRef" :data="chartData" :options="chartOptions" :plugins="[dataLabelsPlugin]" />
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 sm:gap-6 mt-2 sm:mt-4">
      <div class="flex items-center gap-1.5 sm:gap-2">
        <span class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#5f1fff]"></span>
        <span class="text-[10px] sm:text-sm font-medium text-ditto-text">Current</span>
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2">
        <span class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#d9c1ff]"></span>
        <span class="text-[10px] sm:text-sm text-ditto-subtext">Previous</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { PerformanceDataPoint } from '../../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  data: PerformanceDataPoint[]
}>()

const chartRef = ref(null)

// Custom plugin to draw data labels at first and last points
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart: any) {
    const ctx = chart.ctx
    const dataset = chart.data.datasets[0]
    const meta = chart.getDatasetMeta(0)
    const chartWidth = chart.width
    
    if (!meta.data.length) return
    
    // Draw label at first point
    const firstPoint = meta.data[0]
    const firstValue = dataset.data[0]
    drawLabel(ctx, firstPoint.x, firstPoint.y, firstValue, '#5f1fff', false, chartWidth)
    
    // Draw label at last point  
    const lastPoint = meta.data[meta.data.length - 1]
    const lastValue = dataset.data[dataset.data.length - 1]
    drawLabel(ctx, lastPoint.x, lastPoint.y, lastValue, '#5f1fff', true, chartWidth)
  }
}

// Format number to abbreviated form (10K, 1.2M, etc.)
function formatShortNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

function drawLabel(ctx: CanvasRenderingContext2D, x: number, y: number, value: number, color: string, isLast: boolean = false, chartWidth: number = 0) {
  const text = formatShortNumber(value)
  ctx.save()
  
  // Measure text
  ctx.font = 'bold 11px Satoshi, sans-serif'
  const textWidth = ctx.measureText(text).width
  const padding = 6
  const boxWidth = textWidth + padding * 2
  const boxHeight = 20
  const radius = 5
  
  // Position above point, but adjust for edge cases
  let boxX = x - boxWidth / 2
  
  // If this is the last point and would overflow right, align to the right edge
  if (isLast && boxX + boxWidth > chartWidth - 10) {
    boxX = x - boxWidth + 10 // Align right side of box closer to point
  }
  
  // If first point would overflow left, align to left
  if (!isLast && boxX < 10) {
    boxX = x - 10
  }
  
  const boxY = y - boxHeight - 10
  
  // Draw rounded rectangle
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, radius)
  ctx.fill()
  
  // Draw text - center it in the box
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, boxX + boxWidth / 2, boxY + boxHeight / 2)
  
  ctx.restore()
}

const chartData = computed(() => ({
  labels: props.data.map(d => d.day),
  datasets: [
    {
      label: 'Current period',
      data: props.data.map(d => d.current),
      borderColor: '#5f1fff',
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx
        const gradient = ctx.createLinearGradient(0, 0, 0, 300)
        gradient.addColorStop(0, 'rgba(95, 31, 255, 0.15)')
        gradient.addColorStop(1, 'rgba(95, 31, 255, 0)')
        return gradient
      },
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 8,
      pointBackgroundColor: '#5f1fff',
      pointBorderColor: '#fff',
      pointBorderWidth: 3,
      pointHoverBackgroundColor: '#5f1fff',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
    },
    {
      label: 'Previous period',
      data: props.data.map(d => d.previous),
      borderColor: '#d9c1ff',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: '#d9c1ff',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
  ],
}))

// Calculate dynamic Y-axis max based on data
const yAxisMax = computed(() => {
  const maxCurrent = Math.max(...props.data.map(d => d.current))
  const maxPrevious = Math.max(...props.data.map(d => d.previous))
  const maxValue = Math.max(maxCurrent, maxPrevious)
  // Round up to nice number
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)))
  return Math.ceil(maxValue / magnitude) * magnitude + magnitude
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 0,
      right: 40,
      top: 30
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#fff',
      titleColor: '#101f3c',
      bodyColor: '#101f3c',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      usePointStyle: true,
      titleFont: {
        size: 12,
        weight: 'bold' as const,
        family: 'Satoshi, sans-serif',
      },
      bodyFont: {
        size: 11,
        family: 'Satoshi, sans-serif',
      },
      callbacks: {
        title: (items: any[]) => {
          return items[0]?.label || ''
        },
        label: (item: any) => {
          return `  ${item.dataset.label}: ${formatShortNumber(item.raw)}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#626984',
        font: {
          size: 10,
          family: 'Satoshi, sans-serif',
        },
        padding: 4,
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 7,
      },
    },
    y: {
      min: 0,
      max: yAxisMax.value,
      border: {
        display: false,
      },
      grid: {
        color: '#efefef',
        drawTicks: false,
      },
      ticks: {
        color: '#626984',
        font: {
          size: 10,
          family: 'Satoshi, sans-serif',
        },
        padding: 8,
        maxTicksLimit: 5,
        callback: (value: string | number) => {
          if (typeof value === 'number') {
            return formatShortNumber(value)
          }
          return value
        },
      },
    },
  },
}))
</script>
