/**
 * صفحة قائمة المسوقين
 */

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Stack,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useMarketers, useDeleteMarketer } from '@/api/marketers';

export default function MarketersListPage() {
  const [page, setPage] = useState('1');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  // جلب المسوقين
  const { data, loading, error, refetch } = useMarketers({
    page,
    limit: '20',
    status,
    search,
  });

  // حذف مسوق
  const { mutate: deleteMarketer, loading: deleting } = useDeleteMarketer({
    onSuccess: () => {
      alert('تم حذف المسوق بنجاح');
      refetch();
    },
    onError: (error) => {
      alert('فشل حذف المسوق: ' + error.message);
    },
  });

  const handleDelete = (marketerId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المسوق؟')) {
      deleteMarketer(undefined, { params: { id: marketerId } });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'موقوف';
      default: return status;
    }
  };

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">خطأ في تحميل البيانات: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">إدارة المسوقين</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* فتح modal الإنشاء */}}
        >
          إضافة مسوق
        </Button>
      </Box>

      {/* الفلاتر */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField
              label="بحث"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 250 }}
            />
            <TextField
              select
              label="الحالة"
              variant="outlined"
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="inactive">غير نشط</MenuItem>
              <MenuItem value="suspended">موقوف</MenuItem>
            </TextField>
            <Button variant="outlined" onClick={refetch}>
              تحديث
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* الجدول */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الاسم</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>البريد الإلكتروني</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>نسبة العمولة</TableCell>
                <TableCell>إجمالي العمولات</TableCell>
                <TableCell>الطلبات</TableCell>
                <TableCell>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((marketer) => (
                <TableRow key={marketer._id}>
                  <TableCell>{marketer.name}</TableCell>
                  <TableCell>{marketer.phone}</TableCell>
                  <TableCell>{marketer.email || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(marketer.status)}
                      color={getStatusColor(marketer.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{marketer.commissionRate}%</TableCell>
                  <TableCell>{marketer.totalCommissions} ريال</TableCell>
                  <TableCell>
                    {marketer.approvedApplications} / {marketer.totalApplications}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(marketer._id)}
                        disabled={deleting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data?.data?.length === 0 && (
          <Box p={3} textAlign="center">
            <Typography color="text.secondary">لا توجد بيانات</Typography>
          </Box>
        )}

        {data && (
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              إجمالي: {data.total} مسوق
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                disabled={page === '1'}
                onClick={() => setPage(String(Number(page) - 1))}
              >
                السابق
              </Button>
              <Typography variant="body2" sx={{ px: 2, py: 1 }}>
                صفحة {page} من {data.pages || 1}
              </Typography>
              <Button
                size="small"
                disabled={page === String(data.pages)}
                onClick={() => setPage(String(Number(page) + 1))}
              >
                التالي
              </Button>
            </Stack>
          </Box>
        )}
      </Card>
    </Box>
  );
}

