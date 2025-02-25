import mongoose, {Document} from 'mongoose'
export interface IInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }
  
export interface IInvoice extends Document {
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    paidDate?: Date;
    client: {
      name: string;
      email: string;
      address: string;
    };
    items: IInvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
    status: 'pending' | 'paid' | 'overdue';
    notes?: string;
    currency: number;
}

const invoiceItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
}) 

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    paidDate:{type: Date, required: false},
    client: {
     name: { type: String, required: true },
     email: { type: String, required: true },
     address: { type: String, required: true },
    },
    items: { type: [invoiceItemSchema], required: true },
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], required: true },
    notes: { type: String },
    currency: { type: Number, required: true },
},{timestamps:true});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice