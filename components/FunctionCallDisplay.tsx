
import React from 'react';
import type { FunctionCall } from '../types';
import { PatientIcon, CalendarIcon, MedicalRecordIcon, BillingIcon } from './icons';

interface FunctionCallDisplayProps {
  functionCall: FunctionCall;
}

const getAgentDetails = (agentName: string) => {
  switch (agentName) {
    case 'manajemen_pasien':
      return {
        title: 'Manajemen Pasien',
        icon: <PatientIcon className="w-6 h-6 text-green-500" />,
        color: 'green',
      };
    case 'penjadwal_janji_temu':
      return {
        title: 'Penjadwal Janji Temu',
        icon: <CalendarIcon className="w-6 h-6 text-purple-500" />,
        color: 'purple',
      };
    case 'rekam_medis':
      return {
        title: 'Rekam Medis',
        icon: <MedicalRecordIcon className="w-6 h-6 text-red-500" />,
        color: 'red',
      };
    case 'penagihan_asuransi':
      return {
        title: 'Penagihan & Asuransi',
        icon: <BillingIcon className="w-6 h-6 text-yellow-500" />,
        color: 'yellow',
      };
    default:
      return {
        title: agentName,
        icon: null,
        color: 'gray',
      };
  }
};

const borderColorClasses: { [key: string]: string } = {
    green: 'border-green-200 dark:border-green-700',
    purple: 'border-purple-200 dark:border-purple-700',
    red: 'border-red-200 dark:border-red-700',
    yellow: 'border-yellow-200 dark:border-yellow-700',
    gray: 'border-gray-200 dark:border-gray-700',
};

const headerBgClasses: { [key: string]: string } = {
    green: 'bg-green-50 dark:bg-green-900/50',
    purple: 'bg-purple-50 dark:bg-purple-900/50',
    red: 'bg-red-50 dark:bg-red-900/50',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/50',
    gray: 'bg-gray-50 dark:bg-gray-800',
};

export const FunctionCallDisplay: React.FC<FunctionCallDisplayProps> = ({ functionCall }) => {
  const { title, icon, color } = getAgentDetails(functionCall.name);
  const borderColor = borderColorClasses[color];
  const headerBg = headerBgClasses[color];

  return (
    <div className={`mt-2 border ${borderColor} rounded-lg overflow-hidden`}>
      <div className={`flex items-center gap-3 p-3 ${headerBg}`}>
        {icon}
        <h3 className="font-bold text-md text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Parameter Panggilan:</h4>
        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto text-gray-700 dark:text-gray-300">
          <code>{JSON.stringify(functionCall.args, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};
