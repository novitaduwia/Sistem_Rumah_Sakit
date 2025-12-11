
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import type { FunctionCall } from '../types.ts';
import { PatientRequestType, AppointmentRequestType, MedicalRecordRequestType, BillingRequestType } from '../types.ts';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `PERAN UTAMA: Anda adalah "Koordinator Pusat Sistem Rumah Sakit Terpadu" (Hospital Integrated System Coordinator). Tugas Anda BUKAN untuk menjawab pertanyaan pengguna secara langsung, melainkan untuk MENGANALISIS INTENSI mereka dengan AKURAT dan Mendelegasikan tugas tersebut ke SATU Sub-agen spesialis yang paling tepat.

ATURAN DELEGASI KRITIS:
1.  ANALYZE & ROUTE: Tentukan dengan pasti apakah permintaan tersebut masuk ke Manajemen Pasien (Pendaftaran/Demografi), Penjadwal Janji Temu (Jadwal/Batal), Rekam Medis (Riwayat/Diagnosis), atau Penagihan (Tagihan/Asuransi).
2.  SINGLE CALL: Anda hanya boleh memanggil SATU sub-agen per permintaan.
3.  FULL CONTEXT: Sampaikan SEMUA detail dan konteks relevan dari kueri asli pengguna ke input sub-agen yang dipilih.
4.  NO SELF-PROCESSING: DILARANG mencoba memproses atau merangkum data sendiri. Selalu gunakan mekanisme Function Calling untuk mendelegasikan permintaan.

PROSES KEAMANAN (WAJIB): Mengingat Anda menangani data sensitif (PHI), pastikan delegasi ke Sub-agen Rekam Medis dan Penagihan memprioritaskan privasi.

HARAPAN KELUARAN: Hasil akhir Anda harus berupa PANGGILAN FUNGSI (Tool Call) ke sub-agen yang sesuai.`;

const tools: FunctionDeclaration[] = [
  {
    name: 'manajemen_pasien',
    description: 'Sub-agen ahli dalam pendaftaran, pembaruan demografi, dan pencatatan ID pasien.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        nama_pasien: { type: Type.STRING, description: 'Nama lengkap pasien.' },
        tanggal_lahir: { type: Type.STRING, description: 'Tanggal lahir pasien (YYYY-MM-DD).' },
        jenis_permintaan: { type: Type.STRING, enum: Object.values(PatientRequestType), description: 'Jenis permintaan manajemen pasien.' },
        detail_permintaan: { type: Type.STRING, description: 'Detail tambahan dari permintaan pengguna.' },
      },
      required: ['nama_pasien', 'jenis_permintaan', 'detail_permintaan'],
    },
  },
  {
    name: 'penjadwal_janji_temu',
    description: 'Sub-agen ahli dalam manajemen slot waktu, konfirmasi, dan alokasi sumber daya.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        id_pasien_atau_nama: { type: Type.STRING, description: 'ID atau nama lengkap pasien.' },
        id_dokter_atau_layanan: { type: Type.STRING, description: 'Nama dokter atau jenis layanan yang diminta.' },
        jenis_permintaan: { type: Type.STRING, enum: Object.values(AppointmentRequestType), description: 'Jenis permintaan janji temu.' },
        tanggal_waktu_preferensi: { type: Type.STRING, description: 'Detail preferensi tanggal dan waktu dari pengguna.' },
      },
      required: ['id_pasien_atau_nama', 'id_dokter_atau_layanan', 'jenis_permintaan', 'tanggal_waktu_preferensi'],
    },
  },
  {
    name: 'rekam_medis',
    description: 'Sub-agen ahli dalam ekstraksi dan perangkuman data klinis (diagnosis, riwayat, hasil lab) menggunakan NLP.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        id_pasien_atau_nama: { type: Type.STRING, description: 'ID atau nama lengkap pasien.' },
        tujuan_permintaan: { type: Type.STRING, enum: Object.values(MedicalRecordRequestType), description: 'Tujuan permintaan terkait rekam medis.' },
        instruksi_keamanan_data: { type: Type.STRING, description: 'Instruksi keamanan data. Default: "Prioritaskan privasi dan enkripsi saat mengambil RME."' },
      },
      required: ['id_pasien_atau_nama', 'tujuan_permintaan'],
    },
  },
  {
    name: 'penagihan_asuransi',
    description: 'Sub-agen ahli dalam RCM, memproses pembayaran, dan verifikasi klaim.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        id_pasien_atau_nama: { type: Type.STRING, description: 'ID atau nama lengkap pasien.' },
        jenis_permintaan: { type: Type.STRING, enum: Object.values(BillingRequestType), description: 'Jenis permintaan terkait penagihan atau asuransi.' },
        detail_finansial: { type: Type.STRING, description: 'Detail finansial seperti nomor tagihan, metode pembayaran, dll.' },
        jumlah: { type: Type.NUMBER, description: 'Jumlah uang untuk pembayaran (jika relevan).' },
      },
      required: ['id_pasien_atau_nama', 'jenis_permintaan', 'detail_finansial'],
    },
  },
];

export const delegateTask = async (userInput: string): Promise<FunctionCall[] | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: tools }],
      },
    });

    return response.functionCalls || null;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the Gemini API call.");
  }
};
