import { useEffect, useState } from "react";
import {
  listPages,
  createPage,
  upsertPage,
  deletePage,
  type CmsPage,
} from "../../api/cmsApi";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function PagesAdmin() {
  const [rows, setRows] = useState<CmsPage[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CmsPage | null>(null);

  async function load() {
    setRows(await listPages());
  }
  useEffect(() => {
    load();
  }, []);

  function newPage() {
    setEditing({ slug: "", title: {}, content: {}, isPublic: true });
    setOpen(true);
  }
  function editPage(p: CmsPage) {
    setEditing({ ...p });
    setOpen(true);
  }
  async function save() {
    if (!editing) return;
    if (editing._id) await upsertPage(editing);
    else await createPage(editing);
    setOpen(false);
    setEditing(null);
    load();
  }
  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("تأكيد الحذف؟")) return;
    await deletePage(id);
    load();
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Pages</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={newPage}>
          إضافة
        </Button>
      </Stack>

      <Stack spacing={2}>
        {rows.map((r) => (
          <Card key={r._id || r.slug}>
            <CardHeader
              title={<Typography fontWeight={600}>{r.slug}</Typography>}
              subheader={
                <Chip size="small" label={r.isPublic ? "Public" : "Private"} />
              }
              action={
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => editPage(r)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => remove(r._id)}>
                    <Delete />
                  </IconButton>
                </Stack>
              }
            />
            <CardContent>
              <Typography variant="subtitle2">AR</Typography>
              <Typography variant="body2" color="text.secondary">
                {r.title?.ar}
              </Typography>
              <Typography variant="subtitle2" mt={1}>
                EN
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {r.title?.en}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editing?._id ? "تحرير صفحة" : "إضافة صفحة"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Slug"
              value={editing?.slug || ""}
              onChange={(e) =>
                setEditing((v) => ({ ...(v as CmsPage), slug: e.target.value }))
              }
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Title (ar)"
                value={editing?.title?.ar || ""}
                onChange={(e) =>
                  setEditing((v) => ({
                    ...(v as CmsPage),
                    title: { ...v?.title, ar: e.target.value },
                  }))
                }
              />
              <TextField
                fullWidth
                label="Title (en)"
                value={editing?.title?.en || ""}
                onChange={(e) =>
                  setEditing((v) => ({
                    ...(v as CmsPage),
                    title: { ...v?.title, en: e.target.value },
                  }))
                }
              />
            </Stack>
            <TextField
              multiline
              minRows={5}
              label="Content (ar)"
              value={editing?.content?.ar || ""}
              onChange={(e) =>
                setEditing((v) => ({
                  ...(v as CmsPage),
                  content: { ...v?.content, ar: e.target.value },
                }))
              }
            />
            <TextField
              multiline
              minRows={5}
              label="Content (en)"
              value={editing?.content?.en || ""}
              onChange={(e) =>
                setEditing((v) => ({
                  ...(v as CmsPage),
                  content: { ...v?.content, en: e.target.value },
                }))
              }
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Public</Typography>
              <input
                type="checkbox"
                checked={!!editing?.isPublic}
                onChange={(e) =>
                  setEditing((v) => ({
                    ...(v as CmsPage),
                    isPublic: e.target.checked,
                  }))
                }
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={save}>
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
