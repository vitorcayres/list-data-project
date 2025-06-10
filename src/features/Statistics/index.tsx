/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Star, Trophy, CircleDollarSign } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";

import { searchLetterAlphabet } from "../../utils/searchLetterAlphabet";
import { getCustomers } from "../../services/Customers";

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ date: string; total: number }[]>([]);
  const [estatistica, setEstatistica] = useState<any>([]);

  async function listData() {
    setIsLoading(true);

    try {
      const response = await getCustomers();

      const saleByDay = response.clientes.flatMap(
        (item) => item.estatisticas.vendas
      );

      const groupData = saleByDay.reduce(
        (acc: Record<string, number>, sale) => {
          acc[sale.data] = (acc[sale.data] || 0) + sale.valor;
          return acc;
        },
        {}
      );

      const chartData = Object.entries(groupData).map(([date, total]) => ({
        date,
        total,
      }));

      const estatisticasBase = response.clientes.map(
        (cliente: {
          estatisticas: { vendas: any };
          info: { nomeCompleto: string; detalhes: { email: string } };
        }) => {
          const vendas = cliente.estatisticas.vendas;
          const total = vendas.reduce(
            (s: any, v: { valor: any }) => s + v.valor,
            0
          );
          const media = vendas.length ? total / vendas.length : 0;
          const frequencia = vendas.length;

          const letraFaltando = searchLetterAlphabet(cliente.info.nomeCompleto);

          return {
            ...cliente,
            total,
            media,
            frequencia,
            letraFaltando: letraFaltando,
          };
        }
      );

      const maxTotal = Math.max(...estatisticasBase.map((c) => c.total));
      const maxMedia = Math.max(...estatisticasBase.map((c) => c.media));
      const maxFrequencia = Math.max(
        ...estatisticasBase.map((c) => c.frequencia)
      );

      const estatisticas = estatisticasBase.map((c) => ({
        ...c,
        maiorVolume: c.total === maxTotal,
        maiorMedia: c.media === maxMedia,
        maiorFrequencia: c.frequencia === maxFrequencia,
      }));

      setEstatistica(estatisticas);
      setData(chartData);
    } catch (error) {
      console.error(error);
      setData([]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    listData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4 px-6">
            {estatistica.map((cliente, index) => (
              <Card key={index} className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {cliente.info.nomeCompleto}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {cliente.info.detalhes.email}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vendas: R$ {cliente.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Média: R$ {cliente.media.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Frequência: {cliente.frequencia}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Letra não usada: <strong>{cliente.letraFaltando}</strong>
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-3 items-center justify-between">
                    {cliente.maiorVolume && (
                      <div className="flex flex-col items-center gap-2">
                        <Trophy />
                        <p className="text-xs text-center text-muted-foreground">
                          Maior Volume
                        </p>
                      </div>
                    )}

                    {cliente.maiorMedia && (
                      <div className="flex flex-col items-center gap-2">
                        <Star />
                        <p className="text-xs text-center text-muted-foreground">
                          Maior Média
                        </p>
                      </div>
                    )}

                    {cliente.maiorMedia && (
                      <div className="flex flex-col items-center gap-2">
                        <CircleDollarSign />
                        <p className="text-xs text-center text-muted-foreground">
                          Maior Frequência
                        </p>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive chartData={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
