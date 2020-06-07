import React, {FC, useState} from 'react';
import {render} from 'react-dom';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import {EncounterChooser} from './components/encounterChooser'
import result from "./queries/types";
import {EncounterView} from "./components/encounterView";
import {
    AppBar, Container,
    createMuiTheme, CssBaseline,
    MuiThemeProvider,
    Tab,
    Tabs,
    Toolbar
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";
import {TabContext, TabPanel} from "@material-ui/lab";
import {purple} from "@material-ui/core/colors";
import {ReportCardLoader} from "./components/ReportCardLoader";

const client = new ApolloClient({
    cache: new InMemoryCache({possibleTypes: result.possibleTypes}),
    link: new HttpLink()
});

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#1a237e',
        },
        secondary: purple,
    },
    overrides: {
        MuiTableCell: {
            root: {
                padding: '2px 8px',
                verticalAlign: 'bottom'
            },
        }
    },
});

const useStyles = makeStyles({
    '@global': {
        '.damageTableEven': {
            backgroundColor: theme.palette.action.hover,
        }
    },
});

const App: FC = () => {
    useStyles()
    const [encounter, setEncounter] = useState(0)
    const [live, setLive] = useState(false)
    const [tab, setTab] = React.useState("1");


    return (<MuiThemeProvider theme={theme}>
        <CssBaseline>
            <TabContext value={tab}>
            <AppBar position="static">
                <Toolbar variant="dense">
                <EncounterChooser current={encounter} update={setEncounter} setLive={setLive}/>
                <Tabs value={tab}  onChange={(event, newValue) => {
                    setTab(newValue);
                    }}>
                <Tab label="Event" value="1"/>
                <Tab label="Report Card" value="2"/>
                </Tabs>
                </Toolbar>
            </AppBar>
            <Container maxWidth={false}>
                <TabPanel value="1">
                    {encounter === 0 ? null : <EncounterView encounterId={encounter} live={live}/>}
                </TabPanel>
                <TabPanel value="2">
                    {encounter === 0 ? null : <ReportCardLoader encounterId={encounter} live={live}/>}
                </TabPanel>
            </Container>
            </TabContext>
        </CssBaseline>
    </MuiThemeProvider>)
}

render(<ApolloProvider client={client}>
    <App/>
</ApolloProvider>, document.getElementById('root'));
