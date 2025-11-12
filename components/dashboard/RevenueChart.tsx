'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatEuro } from '@/lib/utils';
import { TrendingUp, DollarSign } from 'lucide-react';

interface RevenueChartProps {
  caActuel: number;
  caProjecte?: number;
  totalAidesPotentielles?: number;
}

export function RevenueChart({ caActuel, caProjecte, totalAidesPotentielles }: RevenueChartProps) {
  const data = [
    {
      name: 'CA Actuel',
      montant: caActuel,
      fill: '#9ca3af', // gray-400
    },
    {
      name: 'CA Projeté avec aides',
      montant: caProjecte || caActuel,
      fill: '#2563eb', // primary-600
    },
  ];

  const gain = caProjecte ? caProjecte - caActuel : 0;
  const gainPercentage = caActuel > 0 ? ((gain / caActuel) * 100).toFixed(1) : 0;

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle>Projection de Chiffre d'Affaires</CardTitle>
            <CardDescription>
              Impact estimé des aides sur votre activité
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">CA Actuel</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatEuro(caActuel)}
              </p>
            </div>

            {caProjecte && (
              <>
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-600 mb-1">CA Projeté</p>
                  <p className="text-2xl font-bold text-primary-700">
                    {formatEuro(caProjecte)}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Gain Potentiel</p>
                  <p className="text-2xl font-bold text-green-700">
                    +{formatEuro(gain)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    +{gainPercentage}%
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Chart */}
          {caProjecte && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatEuro(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="montant" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Total Aides Info */}
          {totalAidesPotentielles !== undefined && totalAidesPotentielles > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">
                    Montant total des aides identifiées
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {formatEuro(totalAidesPotentielles)}
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    La projection prend en compte un taux d'impact de 70% des aides sur votre chiffre d'affaires
                  </p>
                </div>
              </div>
            </div>
          )}

          {!caProjecte && (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">
                Les projections seront disponibles une fois que les aides auront été analysées
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
