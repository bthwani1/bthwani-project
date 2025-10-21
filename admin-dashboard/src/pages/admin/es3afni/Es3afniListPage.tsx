import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Bloodtype as BloodIcon,
} from '@mui/icons-material';
import { getEs3afniList, updateEs3afniStatus, deleteEs3afni, type Es3afniItem } from '../../../api/es3afni';
import { Es3afniStatus, Es3afniStatusLabels, Es3afniStatusColors } from '../../../types/es3afni';
import RequireAdminPermission from '../../../components/RequireAdminPermission';

const Es3afniListPage: React.FC = () => {
  const navigate = useNavigate();
  const [es3afniItems, setEs3afniItems] = useState<Es3afniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>('all');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    es3afni: Es3afniItem | null;
    action: 'update_status' | 'delete';
    newStatus?: Es3afniStatus;
  }>({
    open: false,
    es3afni: null,
    action: 'update_status',
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // جلب قائمة البلاغات
  const fetchEs3afniItems = useCallback(async (cursor?: string, append: boolean = false) => {
    try {
      setLoading(true);
      const params: any = { limit: 25 };
      if (cursor) params.cursor = cursor;

      const response = await getEs3afniList(params);
      const newItems = response.items || [];

      setEs3afniItems(prev => append ? [...prev, ...newItems] : newItems);
      setNextCursor(response.nextCursor || null);
      setHasMore(!!response.nextCursor && newItems.length === 25);
    } catch (error) {
      console.error('خطأ في جلب قائمة البلاغات:', error);
      setSnackbar({
        open: true,
        message: 'فشل في تحميل قائمة البلاغات',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEs3afniItems();
  }, [fetchEs3afniItems]);

  // تحديث حالة البلاغ
  const handleStatusUpdate = async (es3afni: Es3afniItem, newStatus: Es3afniStatus) => {
    try {
      await updateEs3afniStatus(es3afni._id, newStatus);
      setSnackbar({
        open: true,
        message: `تم تحديث حالة البلاغ بنجاح`,
        severity: 'success',
      });
      fetchEs3afniItems();
    } catch (error) {
      console.error('خطأ في تحديث حالة البلاغ:', error);
      setSnackbar({
        open: true,
        message: 'فشل في تحديث حالة البلاغ',
        severity: 'error',
      });
    }
  };

  // حذف البلاغ
  const handleDeleteEs3afni = async (es3afni: Es3afniItem) => {
    try {
      await deleteEs3afni(es3afni._id);
      setSnackbar({
        open: true,
        message: 'تم حذف البلاغ بنجاح',
        severity: 'success',
      });
      fetchEs3afniItems();
    } catch (error) {
      console.error('خطأ في حذف البلاغ:', error);
      setSnackbar({
        open: true,
        message: 'فشل في حذف البلاغ',
        severity: 'error',
      });
    }
  };

  // فتح نافذة التأكيد
  const openConfirmDialog = (es3afni: Es3afniItem, action: 'update_status' | 'delete', newStatus?: Es3afniStatus) => {
    setConfirmDialog({ open: true, es3afni, action, newStatus });
  };

  // إغلاق نافذة التأكيد
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, es3afni: null, action: 'update_status' });
  };

  // تأكيد العملية
  const confirmAction = async () => {
    if (!confirmDialog.es3afni) return;

    const { es3afni, action, newStatus } = confirmDialog;

    switch (action) {
      case 'update_status':
        if (newStatus) await handleStatusUpdate(es3afni, newStatus);
        break;
      case 'delete':
        await handleDeleteEs3afni(es3afni);
        break;
    }

    closeConfirmDialog();
  };

  // فلترة العناصر محلياً للبحث
  const filteredItems = es3afniItems.filter((item) => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesBloodType = bloodTypeFilter === 'all' || item.bloodType === bloodTypeFilter;

    return matchesSearch && matchesStatus && matchesBloodType;
  });

  // تحميل المزيد
  const loadMore = () => {
    if (nextCursor && !loading) {
      fetchEs3afniItems(nextCursor, true);
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: Es3afniStatus) => {
    return Es3afniStatusColors[status] || 'default';
  };

  // قائمة فصائل الدم الشائعة
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <RequireAdminPermission permission="read">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              إدارة بلاغات إسعفني
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إدارة بلاغات الحاجة للتبرع بالدم ومتابعة حالاتها
            </Typography>
          </Box>
        </Box>

        {/* فلاتر البحث */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="البحث في البلاغات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>فصيلة الدم</InputLabel>
              <Select
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
                label="فصيلة الدم"
              >
                <MenuItem value="all">جميع الفصائل</MenuItem>
                {bloodTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>الحالة</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="الحالة"
              >
                <MenuItem value="all">جميع الحالات</MenuItem>
                {Object.values(Es3afniStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {Es3afniStatusLabels[status]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* جدول البلاغات */}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>البلاغ</TableCell>
                <TableCell>فصيلة الدم</TableCell>
                <TableCell>الموقع</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>تاريخ الإنشاء</TableCell>
                <TableCell align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && es3afniItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      لا توجد بلاغات متاحة
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonIcon color="action" />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {item.title}
                          </Typography>
                          {item.description && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.description.length > 50
                                ? `${item.description.substring(0, 50)}...`
                                : item.description
                              }
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BloodIcon color="error" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                          {item.bloodType || 'غير محدد'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {item.location?.address || 'غير محدد'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={Es3afniStatusLabels[item.status]}
                        size="small"
                        color={getStatusColor(item.status)}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="عرض التفاصيل">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/admin/es3afni/${item._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="تغيير الحالة">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openConfirmDialog(item, 'update_status', Es3afniStatus.CONFIRMED)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="حذف">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openConfirmDialog(item, 'delete')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* زر تحميل المزيد */}
          {hasMore && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* نافذة التأكيد */}
        <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
          <DialogTitle>
            تأكيد العملية
          </DialogTitle>
          <DialogContent>
            <Typography>
              {confirmDialog.action === 'update_status' && confirmDialog.newStatus && (
                <>هل أنت متأكد من تغيير حالة البلاغ "{confirmDialog.es3afni?.title}" إلى "{Es3afniStatusLabels[confirmDialog.newStatus]}"؟</>
              )}
              {confirmDialog.action === 'delete' && (
                <>هل أنت متأكد من حذف البلاغ "{confirmDialog.es3afni?.title}"؟</>
              )}
            </Typography>
            {confirmDialog.action === 'delete' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                هذا الإجراء لا يمكن التراجع عنه
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog}>إلغاء</Button>
            <Button
              onClick={confirmAction}
              variant="contained"
              color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
            >
              تأكيد
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar للرسائل */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </RequireAdminPermission>
  );
};

export default Es3afniListPage;
