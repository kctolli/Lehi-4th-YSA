'use client';

import SecondHourAttendanceTable from '@/components/SecondHourAttendanceTable';

const SecondHourAttendancePage = () => <SecondHourAttendanceTable queryKey={['bishopric', 'second-hour-attendance']} endpoint="/api/bishopric/second-hour-attendance" />;

export default SecondHourAttendancePage;
