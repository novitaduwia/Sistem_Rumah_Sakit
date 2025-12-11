
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  functionCall?: FunctionCall;
}

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

export enum PatientRequestType {
  NEW_REGISTRATION = "PENDAFTARAN_BARU",
  UPDATE_CONTACT = "PERBARUI_KONTAK",
  GET_DEMOGRAPHICS = "AMBIL_DEMOGRAFI",
}

export enum AppointmentRequestType {
  NEW_SCHEDULE = "JADWAL_BARU",
  RESCHEDULE = "JADWAL_ULANG",
  CANCELLATION = "PEMBATALAN",
}

export enum MedicalRecordRequestType {
  GET_HISTORY = "AMBIL_RIWAYAT",
  GET_DIAGNOSIS = "AMBIL_DIAGNOSIS",
  SUMMARIZE_CARE = "RANGKUMAN_PERAWATAN",
}

export enum BillingRequestType {
  CHECK_BILL = "PERIKSA_TAGIHAN",
  PROCESS_PAYMENT = "PROSES_PEMBAYARAN",
  INSURANCE_CLAIM_ASSISTANCE = "BANTUAN_KLAIM_ASURANSI",
}
