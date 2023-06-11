/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';

import {
  BaseHeaderLayout,
  Box,
  Button,
  ContentLayout,
  DatePicker,
  Divider,
  Grid,
  GridItem,
  GridLayout,
  Layout,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography
} from '@strapi/design-system';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';
import moment from 'moment';
import { Refresh } from '@strapi/icons';
import mainApi from '../../api/mainApi';
import { IReportForOffice } from '../../../../types';

const HomePage = () => {
  const [dateFrom, setDateFrom] = useState(
    moment().subtract(1, 'month').startOf('days').toDate()
  );
  const [dateTo, setDateTo] = useState(moment().startOf('days').toDate());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<IReportForOffice[]>([]);

  useEffect(() => {
    getData();
  }, [setData, setIsLoading]);

  function getData(): void {
    setIsLoading(true);
    mainApi
      .getAll(dateFrom.toISOString(), dateTo.toISOString())
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  function arraySum(arr: number[]) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseFloat(`${arr[i]}`);
    }
    return sum;
  }

  if (isLoading) return <LoadingIndicatorPage />;

  return (
    <Layout>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Reports"
          subtitle="Importa i file"
          as="h1"
          primaryAction={
            <Button startIcon={<Refresh />} onClick={() => getData()}>
              Aggiorna ora
            </Button>
          }
        />
      </Box>

      <ContentLayout>
        <>
          <Box paddingBottom={5}>
            <>
              <Grid col={2}>
                <GridItem col={6} s={12}></GridItem>
                <GridItem col={3} s={12}>
                  <Box padding={1}>
                    <DatePicker
                      label="Da"
                      selectedDate={dateFrom}
                      onChange={setDateFrom}
                    />
                  </Box>
                </GridItem>
                <GridItem col={3} s={12}>
                  <Box padding={1}>
                    <DatePicker
                      label="A"
                      onChange={setDateTo}
                      selectedDate={dateTo}
                    />
                  </Box>
                </GridItem>
              </Grid>
            </>
          </Box>
          {data.map((item, index) => (
            <Box key={index}>
              <Box>
                <Box paddingBottom={2}>
                  <Typography variant="alpha">{item.nome}</Typography>
                </Box>
                <GridLayout>
                  <Box>
                    <Box paddingBottom={3}>
                      <Typography variant="epsilon">
                        Operazioni per operatore
                      </Typography>
                    </Box>
                    <Box>
                      <Table colCount={4} rowCount={1}>
                        <Thead>
                          <Tr>
                            <Th>
                              <Typography variant="sigma">Operatore</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">N.ro</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Importo</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Offerta</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Tot.</Typography>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {item.operazioniUtente.map((op, index) => (
                            <Tr key={index}>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.firstname} {op.lastname}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.numOperazioni}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.importo}€
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.offerta} €
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.totale} €
                                </Typography>
                              </Td>
                            </Tr>
                          ))}
                          <Tr>
                            <Td></Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniUtente.map(
                                    (op) => op.numOperazioni
                                  )
                                )}
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniUtente.map((op) => op.importo)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniUtente.map((op) => op.offerta)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniUtente.map((op) => op.totale)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                  <Box>
                    <Box paddingBottom={3}>
                      <Typography variant="epsilon">
                        Operazioni per offerta
                      </Typography>
                    </Box>
                    <Box>
                      <Table colCount={4} rowCount={1}>
                        <Thead>
                          <Tr>
                            <Th>
                              <Typography variant="sigma">Offerta</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">N.ro</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Importo</Typography>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {item.operazioniOfferta.map((op, index) => (
                            <Tr key={index}>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.nome}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.numOperazioni}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.importo}€
                                </Typography>
                              </Td>
                            </Tr>
                          ))}
                          <Tr>
                            <Td></Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniOfferta.map(
                                    (op) => op.numOperazioni
                                  )
                                )}
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniOfferta.map((op) => op.importo)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </GridLayout>
                <Box paddingTop={5}></Box>
                <GridLayout>
                  <Box>
                    <Box paddingBottom={3}>
                      <Typography variant="epsilon">
                        Operazioni per tipo
                      </Typography>
                    </Box>
                    <Box>
                      <Table colCount={4} rowCount={1}>
                        <Thead>
                          <Tr>
                            <Th>
                              <Typography variant="sigma">
                                Operazione
                              </Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">N.ro</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Importo</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Offerta</Typography>
                            </Th>
                            <Th>
                              <Typography variant="sigma">Tot.</Typography>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {item.operazioniTipo.map((op, index) => (
                            <Tr key={index}>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.nome}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.numOperazioni}
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.importo}€
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.offerta} €
                                </Typography>
                              </Td>
                              <Td>
                                <Typography textColor="neutral800">
                                  {op.totale} €
                                </Typography>
                              </Td>
                            </Tr>
                          ))}
                          <Tr>
                            <Td></Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniTipo.map(
                                    (op) => op.numOperazioni
                                  )
                                )}
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniTipo.map((op) => op.importo)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniTipo.map((op) => op.offerta)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                            <Td>
                              <Typography textColor="success500">
                                {arraySum(
                                  item.operazioniTipo.map((op) => op.totale)
                                )}{' '}
                                €
                              </Typography>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </GridLayout>
              </Box>
              <Box paddingTop={10} paddingBottom={10}>
                <Divider />
              </Box>
            </Box>
          ))}
        </>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
