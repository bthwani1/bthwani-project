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
  Avatar,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { getAdmins, updateAdminStatus, deleteAdmin, type AdminUser } from '../../api/adminUsers';
import { AdminRole } from '../../types/adminUsers';
import { useAdminUser } from '../../hook/useAdminUser';
import { useCanWriteAdmins, useCanEditAdmins, useCanDeleteAdmins } from '../../hook/useCapabilities';
import RequireAdminPermission from '../../components/RequireAdminPermission';

const AdminsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    admin: AdminUser | null;
    action: 'activate' | 'deactivate' | 'delete';
  }>({
    open: false,
    admin: null,
    action: 'activate',
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

  // حالة المستخدم والصلاحيات
  const { user, loading: userLoading } = useAdminUser();
  const canWriteAdmins = useCanWriteAdmins(user);
  const canEditAdmins = useCanEditAdmins(user);
  const canDeleteAdmins = useCanDeleteAdmins(user);

  // جلب المسؤولين
  const fetchAdmins = useCallback(async () => {
    try {
      const params: Record<string, unknown> = {};

      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';

      const response = await getAdmins(params);
      setAdmins(response.admins || []);
    } catch (error) {
      console.error('خطأ في جلب المسؤولين:', error);
      setSnackbar({
        open: true,
        message: 'فشل في تحميل قائمة المسؤولين',
        severity: 'error',
      });
    }
  }, [searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // معالجة تحديث حالة المسؤول
  const handleStatusUpdate = async (admin: AdminUser, isActive: boolean) => {
    try {
      await updateAdminStatus(admin._id, isActive);
      setSnackbar({
        open: true,
        message: `تم ${isActive ? 'تفعيل' : 'تعطيل'} المسؤول بنجاح`,
        severity: 'success',
      });
      fetchAdmins();
    } catch (error) {
      console.error('خطأ في تحديث حالة المسؤول:', error);
      setSnackbar({
        open: true,
        message: 'فشل في تحديث حالة المسؤول',
        severity: 'error',
      });
    }
  };

  // معالجة حذف المسؤول
  const handleDeleteAdmin = async (admin: AdminUser) => {
    try {
      await deleteAdmin(admin._id);
      setSnackbar({
        open: true,
        message: 'تم حذف المسؤول بنجاح',
        severity: 'success',
      });
      fetchAdmins();
    } catch (error) {
      console.error('خطأ في حذف المسؤول:', error);
      setSnackbar({
        open: true,
        message: 'فشل في حذف المسؤول',
        severity: 'error',
      });
    }
  };

  // فتح نافذة التأكيد
  const openConfirmDialog = (admin: AdminUser, action: 'activate' | 'deactivate' | 'delete') => {
    setConfirmDialog({ open: true, admin, action });
  };

  // إغلاق نافذة التأكيد
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, admin: null, action: 'activate' });
  };

  // تأكيد العملية
  const confirmAction = async () => {
    if (!confirmDialog.admin) return;

    const { admin, action } = confirmDialog;

    switch (action) {
      case 'activate':
        await handleStatusUpdate(admin, true);
        break;
      case 'deactivate':
        await handleStatusUpdate(admin, false);
        break;
      case 'delete':
        await handleDeleteAdmin(admin);
        break;
    }

    closeConfirmDialog();
  };

  // حساب عدد الصلاحيات
  const getPermissionCount = (admin: AdminUser): number => {
    return Object.values(admin.permissions).reduce((total, module) => {
      return total + Object.values(module).filter(Boolean).length;
    }, 0);
  };

  // فلترة المسؤولين محلياً للبحث
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = searchTerm === '' ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' ||
      admin.roles.some(role => role === roleFilter);

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && admin.isActive) ||
      (statusFilter === 'inactive' && !admin.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RequireAdminPermission permission="read">
      <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            إدارة المسؤولين
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إدارة حسابات المشرفين وصلاحياتهم في النظام
          </Typography>
        </Box>

        {canWriteAdmins && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/admins/new')}
          >
            إضافة مسؤول جديد
          </Button>
        )}
      </Box>

      {/* فلاتر البحث */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="البحث في المسؤولين..."
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

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>الدور</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="الدور"
            >
              <MenuItem value="all">جميع الأدوار</MenuItem>
              {Object.values(AdminRole).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="الحالة"
            >
              <MenuItem value="all">جميع الحالات</MenuItem>
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="inactive">معطل</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* جدول المسؤولين */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>المسؤول</TableCell>
              <TableCell>الأدوار</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>آخر دخول</TableCell>
              <TableCell>عدد الصلاحيات</TableCell>
              <TableCell>تاريخ الإنشاء</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    لا توجد مسؤولين متاحين
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {admin.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {admin._id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {admin.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Badge
                      color={admin.isActive ? 'success' : 'error'}
                      variant="dot"
                      sx={{ mr: 1 }}
                    >
                      <Chip
                        label={admin.isActive ? 'نشط' : 'معطل'}
                        size="small"
                        color={admin.isActive ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {admin.lastLogin
                        ? new Date(admin.lastLogin).toLocaleDateString('ar-SA')
                        : 'لم يسجل دخول بعد'
                      }
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {getPermissionCount(admin)} صلاحية
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {new Date(admin.createdAt).toLocaleDateString('ar-SA')}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {canEditAdmins && (
                        <Tooltip title="تعديل">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/admin/admins/${admin._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canEditAdmins && (
                        <Tooltip title={admin.isActive ? 'تعطيل' : 'تفعيل'}>
                          <IconButton
                            size="small"
                            color={admin.isActive ? 'warning' : 'success'}
                            onClick={() =>
                              openConfirmDialog(
                                admin,
                                admin.isActive ? 'deactivate' : 'activate'
                              )
                            }
                          >
                            {admin.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                          </IconButton>
                        </Tooltip>
                      )}

                      {canDeleteAdmins && (
                        <Tooltip title="حذف">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openConfirmDialog(admin, 'delete')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* نافذة التأكيد */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>
          تأكيد العملية
        </DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من أنك تريد{' '}
            {confirmDialog.action === 'activate' && 'تفعيل'}
            {confirmDialog.action === 'deactivate' && 'تعطيل'}
            {confirmDialog.action === 'delete' && 'حذف'}
            {' '}
            المسؤول "{confirmDialog.admin?.username}"؟
          </Typography>
          {confirmDialog.action === 'deactivate' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              سيفقد هذا المسؤول الوصول إلى النظام
            </Alert>
          )}
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
            color={
              confirmDialog.action === 'delete' ? 'error' :
              confirmDialog.action === 'deactivate' ? 'warning' : 'primary'
            }
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

export default AdminsListPage;
