'use client';

import SecondHourAttendanceTable from '@/components/SecondHourAttendanceTable';

const SecondHourAttendancePage = () => <SecondHourAttendanceTable queryKey={['ward-council', 'second-hour-attendance']} endpoint="/api/ward-council/second-hour-attendance" />;

export default SecondHourAttendancePage;
