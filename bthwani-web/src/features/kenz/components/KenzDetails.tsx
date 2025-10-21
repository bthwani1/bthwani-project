// src/features/kenz/components/KenzDetails.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { KenzItem, KenzStatusLabels, KenzCategoryLabels, KenzStatusColors, KenzCategoryColors } from '../types';

interface KenzDetailsProps {
  item: KenzItem;
  loading?: boolean;
  onBack?: () => void;
  onEdit?: (item: KenzItem) => void;
  onDelete?: (item: KenzItem) => void;
}

const KenzDetails: React.FC<KenzDetailsProps> = ({
  item,
  loading = false,
  onBack,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const handleEdit = () => {
    onEdit?.(item);
  };

  const handleDelete = () => {
    onDelete?.(item);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            تفاصيل الإعلان
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {onEdit && (
            <Tooltip title="تعديل الإعلان">
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="حذف الإعلาน">
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Title and Status */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {item.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {item.category && (
              <Chip
                label={KenzCategoryLabels[item.category]}
                sx={{
                  backgroundColor: KenzCategoryColors[item.category],
                  color: 'white',
                }}
                icon={<CategoryIcon />}
              />
            )}
            <Chip
              label={KenzStatusLabels[item.status]}
              sx={{
                backgroundColor: KenzStatusColors[item.status],
                color: 'white',
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Price */}
        {item.price && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ mr: 1 }} />
              السعر
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {formatCurrency(item.price)}
            </Typography>
          </Box>
        )}

        {/* Description */}
        {item.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              الوصف
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {item.description}
            </Typography>
          </Box>
        )}

        {/* Metadata */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              معلومات إضافية
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(item.metadata).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {key}
                    </Typography>
                    <Typography variant="body2">
                      {String(value)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Owner Information */}
        {item.owner && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} />
              معلومات البائع
            </Typography>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    الاسم
                  </Typography>
                  <Typography variant="body1">
                    {item.owner.name}
                  </Typography>
                </Grid>

                {item.owner.email && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 0.5, fontSize: 16 }} />
                      البريد الإلكتروني
                    </Typography>
                    <Typography variant="body1">
                      {item.owner.email}
                    </Typography>
                  </Grid>
                )}

                {item.owner.phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 0.5, fontSize: 16 }} />
                      رقم الهاتف
                    </Typography>
                    <Typography variant="body1">
                      {item.owner.phone}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Dates */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                تاريخ النشر
              </Typography>
              <Typography variant="body2">
                {formatDate(item.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                آخر تحديث
              </Typography>
              <Typography variant="body2">
                {formatDate(item.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default KenzDetails;
