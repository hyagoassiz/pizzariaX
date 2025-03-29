import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  ListSubheader,
  Drawer as MuiDrawer,
  useMediaQuery,
} from "@mui/material";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AppBar } from "../AppBar";
import useDrawer from "./hooks/useDrawer";
import { setDrawerOpen } from "../../redux/drawerSlice";
import { useDispatch } from "react-redux";
import { ReactNode } from "react";
import { rotas } from "./constants/constants";
import { useLocation, useNavigate } from "react-router-dom";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${240}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface IDrawer {
  children: ReactNode;
}

export const Drawer: React.FC<IDrawer> = ({ children }) => {
  const { drawer } = useDrawer();

  const theme = useTheme();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [opcaoSelecionada, setOpcaoSelecionada] =
    React.useState<string>("Transações");

  function handleSelect(rota: string): void {
    navigate(rota);
    setOpcaoSelecionada(rota);
    if (isMobile) {
      dispatch(setDrawerOpen(false));
    }
  }

  React.useEffect(() => {
    setOpcaoSelecionada(location.pathname);
  }, [location]);

  React.useEffect(() => {
    dispatch(setDrawerOpen(!isMobile));
  }, [isMobile, dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />

      <MuiDrawer
        sx={{
          width: isMobile ? "100vw" : drawer.drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "100vw" : drawer.drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={drawer.isOpen}
        onClose={() => dispatch(setDrawerOpen(false))}
      >
        <DrawerHeader>
          <IconButton onClick={() => dispatch(setDrawerOpen(false))}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {rotas.map((categoria, index) => (
          <Box key={index}>
            <ListSubheader>{categoria.categoria}</ListSubheader>
            {categoria.rotas.map((rota) => (
              <List key={rota.name} disablePadding>
                <ListItem
                  disablePadding
                  onClick={async () => {
                    if (rota.function) {
                      await rota.function();
                    }
                    handleSelect(rota.route);
                  }}
                  sx={{
                    color:
                      opcaoSelecionada === rota.route
                        ? theme.palette.secondary.light
                        : "",
                    "&:hover": {
                      opacity: "80%",
                    },
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                      }}
                    >
                      {rota.icon}
                    </ListItemIcon>
                    <ListItemText primary={rota.name} />
                  </ListItemButton>
                </ListItem>
              </List>
            ))}
          </Box>
        ))}
      </MuiDrawer>
      <Main open={drawer.isOpen}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};
