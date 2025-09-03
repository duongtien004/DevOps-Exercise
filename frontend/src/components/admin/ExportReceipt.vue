<template>
  <div class="w-full max-w-4xl bg-white rounded-lg shadow-xl">
    <!-- Modal Content -->
    <div class="p-6">
      <!-- Preview Receipt -->
      <div id="receipt-container" class="bg-white p-8" ref="receiptRef">
        <!-- Company Info -->
        <div class="text-center mb-4">
          <h1 class="text-xl font-bold uppercase">{{ companyInfo.name }}</h1>
          <p>{{ companyInfo.address }}</p>
          <p>Tel: {{ companyInfo.phone }} - Email: {{ companyInfo.email }}</p>
        </div>

        <!-- Receipt Title -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold">EXPORT RECEIPT</h2>
          <p class="text-sm italic">No: {{ receiptInfo.code }}</p>
        </div>

        <!-- Receipt Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p>
              <span class="font-medium">Date:</span>
              {{ formatDate(receiptInfo.date) }}
            </p>
            <p>
              <span class="font-medium">Customer:</span>
              {{ receiptInfo.customer }}
            </p>
            <p>
              <span class="font-medium">Address:</span>
              {{ receiptInfo.customerAddress }}
            </p>
          </div>
          <div>
            <p>
              <span class="font-medium">Created By:</span>
              {{ receiptInfo.creator }}
            </p>
            <p>
              <span class="font-medium">Reason:</span>
              {{ receiptInfo.reason }}
            </p>
          </div>
        </div>

        <!-- Products Table -->
        <table class="w-full mb-6 border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-50">
              <th class="border border-gray-300 p-2 text-center">No.</th>
              <th class="border border-gray-300 p-2">Product Code</th>
              <th class="border border-gray-300 p-2">Product Name</th>
              <th class="border border-gray-300 p-2 text-right">Qty</th>
              <th class="border border-gray-300 p-2 text-right">Unit Price</th>
              <th class="border border-gray-300 p-2 text-right">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in receiptInfo.products" :key="index">
              <td class="border border-gray-300 p-2 text-center">
                {{ index + 1 }}
              </td>
              <td class="border border-gray-300 p-2">{{ item.code }}</td>
              <td class="border border-gray-300 p-2">{{ item.name }}</td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatNumber(item.quantity) }}
              </td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatCurrency(item.price) }}
              </td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatCurrency(item.quantity * item.price) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-bold">
              <td colspan="3" class="border border-gray-300 p-2 text-right">
                Total:
              </td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatNumber(totalQuantity) }}
              </td>
              <td class="border border-gray-300 p-2"></td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatCurrency(totalAmount) }}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Amount in Words -->
        <div class="mb-6">
          <p>
            <span class="font-medium">Amount in words:</span>
            {{ amountInWords }}
          </p>
        </div>

        <!-- Signatures -->
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="font-medium">Created By</p>
            <p class="text-sm italic">(Signature, Full Name)</p>
            <div class="h-20"></div>
            <p>{{ receiptInfo.creator }}</p>
          </div>

          <div>
            <p class="font-medium">Received By</p>
            <p class="text-sm italic">(Signature, Full Name)</p>
            <div class="h-20"></div>
            <p>{{ receiptInfo.receiver }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 mt-6">
        <button
          @click="downloadPDF"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          :disabled="isGenerating"
        >
          <span v-if="isGenerating">Generating PDF...</span>
          <span v-else>Download PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

// Props
const props = defineProps({
  exportData: {
    type: Object,
    required: true,
  },
  selectedOrder: {
    type: Object,
    required: true,
  },
})

// Refs
const receiptRef = ref(null)
const isGenerating = ref(false)

// Company Info
const companyInfo = {
  name: 'ABC COMPANY LTD',
  address: '123 ABC Street, XYZ District, HCM City',
  phone: '028.1234.5678',
  email: 'info@abc.com',
}

// Receipt Info
const receiptInfo = {
  code: `EXP${new Date().getTime().toString().slice(-6)}`,
  date: props.selectedOrder.exportDate,
  customer: props.selectedOrder.customerName,
  customerAddress: props.selectedOrder.customerAddress,
  warehouse: 'Main Warehouse',
  creator: 'John Doe',
  keeper: 'Jane Smith',
  receiver: props.selectedOrder.receiver || 'Customer Name',
  reason: props.selectedOrder.reason || 'Stock export to customer',
  products: props.selectedOrder.items,
}

// Computed
const totalQuantity = computed(() => {
  return receiptInfo.products.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  )
})

const totalAmount = computed(() => {
  return receiptInfo.products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  )
})

const amountInWords = computed(() => {
  // Implement number to words conversion here
  return 'One hundred million VND only' // Placeholder
})

// Methods
const formatDate = date => {
  return format(new Date(date), 'MM/dd/yyyy', { locale: enUS })
}

const formatNumber = num => {
  return new Intl.NumberFormat('en-US').format(num)
}

const formatCurrency = amount => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const downloadPDF = async () => {
  try {
    isGenerating.value = true
    const element = receiptRef.value

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
    })

    const imgWidth = 210 - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(canvas, 'JPEG', 10, 10, imgWidth, imgHeight, '', 'FAST')
    pdf.save(`export-receipt-${receiptInfo.code}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('An error occurred while generating PDF. Please try again.')
  } finally {
    isGenerating.value = false
  }
}
</script>
