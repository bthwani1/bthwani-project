import { useState } from "react";
import { Outlet } from "react-router-dom";
import { styled, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const drawerWidth = 350;

const MainContent = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  marginLeft: drawerWidth,
  transition: theme.transitions.create(["margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
  },
}));

const Main = styled("main")(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
      <MainContent>
        <TopBar onToggleDrawer={handleDrawerToggle} />
        <Main>
          <Outlet />
        </Main>
      </MainContent>
    </Box>
  );
}
