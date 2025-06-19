"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface PatientContextBarProps {
  patientId?: string;
  mrn?: string;
  onPatientLoad?: (patient: any) => void;
}

export default function PatientContextBar({
  patientId,
  mrn,
  onPatientLoad
}: PatientContextBarProps) {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId || mrn) {
      loadPatient();
    }
  }, [patientId, mrn]);

  const loadPatient = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (patientId) params.append('id', patientId);
      if (mrn) params.append('mrn', mrn);

      const response = await fetch(`/api/epic/patient?${params}`);
      if (!response.ok) throw new Error('Failed to load patient');

      const data = await response.json();
      setPatient(data);
      onPatientLoad?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Load demo patient on error
      loadDemoPatient();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoPatient = async () => {
    const response = await fetch('/api/epic/patient?id=demo');
    const data = await response.json();
    setPatient(data);
    onPatientLoad?.(data);
  };

  if (!patient && !loading) {
    return (
      <Card className="p-4 bg-blue-900 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm">No patient loaded</span>
          <Button size="sm" onClick={loadDemoPatient}>
            Load Demo Patient
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-4 bg-gray-800 text-white">
        <div className="animate-pulse">Loading patient data from EPIC...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-900 text-white border-red-700">
        <span>EPIC connection failed - using demo data</span>
      </Alert>
    );
  }

  return (
    <Card className="p-4 bg-gray-900 text-white">
      <div className="space-y-3">
        {/* Patient Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{patient.name}</h3>
            <div className="text-sm text-gray-400">
              MRN: {patient.mrn} | {calculateAge(patient.birthDate)}y {patient.gender}
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-800">
            {patient.computed?.activeProtocol || 'No Protocol'}
          </Badge>
        </div>

        {/* Diagnoses */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-1">DIAGNOSES</h4>
          <div className="space-y-1">
            {patient.diagnoses?.slice(0, 2).map((dx: any, idx: number) => (
              <div key={idx} className="text-sm">
                <Badge variant="secondary" className="mr-2 text-xs">
                  {dx.code}
                </Badge>
                {dx.display}
              </div>
            ))}
          </div>
        </div>

        {/* Key Labs */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-1">RECENT LABS</h4>
          <div className="grid grid-cols-2 gap-2">
            {patient.labs?.slice(0, 4).map((lab: any, idx: number) => (
              <div key={idx} className="text-sm bg-gray-800 p-2 rounded">
                <div className="font-semibold">{lab.name}</div>
                <div className="flex items-center gap-1">
                  <span className={lab.flag === 'H' ? 'text-red-400' : lab.flag === 'L' ? 'text-yellow-400' : ''}>
                    {lab.value} {lab.unit}
                  </span>
                  {lab.flag && <Badge variant="outline" className="text-xs">{lab.flag}</Badge>}
                </div>
                <div className="text-xs text-gray-500">{formatDate(lab.date)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Summary */}
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-400">Days on treatment: </span>
            <span className="font-semibold">{patient.computed?.daysOnTreatment || 0}</span>
          </div>
          <div>
            <span className="text-gray-400">Marker trend: </span>
            <Badge
              variant={patient.computed?.tumorMarkerTrend === 'decreasing' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {patient.computed?.tumorMarkerTrend || 'unknown'}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => window.open(`/epic/chart/${patient.id}`, '_blank')}>
            Open Chart
          </Button>
          <Button size="sm" variant="outline" onClick={() => {
            // Trigger AI analysis with patient context
            const event = new CustomEvent('analyze-patient', { detail: patient });
            window.dispatchEvent(event);
          }}>
            AI Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}