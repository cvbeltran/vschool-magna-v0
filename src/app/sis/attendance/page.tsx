"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface AttendanceSummary {
  date: string;
  batch_id: string | null;
  present_count: number;
  absent_count: number;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from("attendance_summary")
        .select("date, batch_id, present_count, absent_count")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching attendance:", error);
        setLoading(false);
        return;
      }

      setAttendance(data || []);
      setLoading(false);
    };

    fetchAttendance();
  }, []);

  const calculateAttendancePercentage = (
    present: number,
    absent: number
  ): string => {
    const total = present + absent;
    if (total === 0) return "—";
    const percentage = (present / total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Attendance</h1>

      {attendance.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No attendance records yet
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Batch
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Present
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Absent
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={`${record.date}-${record.batch_id || index}`} className="border-b">
                  <td className="px-4 py-3 text-sm">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {record.batch_id || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">{record.present_count}</td>
                  <td className="px-4 py-3 text-sm">{record.absent_count}</td>
                  <td className="px-4 py-3 text-sm">
                    {calculateAttendancePercentage(
                      record.present_count,
                      record.absent_count
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

