import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col">
      <header className="py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-brand-dark">CREATIVE FIDELIZA</h1>
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl mx-auto py-12 px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          <Card className="border-2 border-brand-primary/10 shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-sky-300">
              <CardTitle className="text-xl text-gray-700">PAINEL DO ADMINISTRADOR</CardTitle>
              <CardDescription className="text-gray-700">Acesso ao painel de gestão para a empresa</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p>Cadastro de clientes e gerenciamento de pontos.</p>
            </CardContent>
            <CardFooter className="">
              <Button asChild className="w-full mt-4 bg-brand-primary hover:bg-brand-primary/90">
                <Link to="/admin">Acessar painel administrativo</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 border-brand-accent/10 shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="bg-orange-300">
              <CardTitle className="text-xl text-gray-700">CONSULTA DE PONTOS</CardTitle>
              <CardDescription className="text-gray-700">Área para clientes consultarem seus pontos</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p>Verifique quantos pontos você acumulou.</p>
            </CardContent>
            <CardFooter className="">
              <Button asChild className="w-full mt-4 bg-brand-accent hover:bg-brand-accent/90">
                <Link to="/check">Consultar meus pontos</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="bg-brand-dark text-white py-6 px-4 mt-auto">
        <div className="container max-w-7xl mx-auto">
          <p className="text-center text-sm">Sistema de Fidelidade © 2025</p>
        </div>
      </footer>
    </div>;
};
export default Index;