
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientesTable from '@/components/ClientesTable';
import { Cliente, buscarClientesComFiltro, listarClientes } from '@/lib/supabaseClient';

const ClientesConsulta = () => {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [filtros, setFiltros] = useState({
    nome: '',
    telefone: '',
    codigo_cartao: '',
    pontos: undefined as number | undefined
  });

  const carregarClientes = async () => {
    setLoadingClientes(true);
    try {
      const data = await listarClientes();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive"
      });
    } finally {
      setLoadingClientes(false);
    }
  };
  
  const aplicarFiltros = async () => {
    setLoadingClientes(true);
    try {
      const clientesFiltrados = await buscarClientesComFiltro(filtros);
      setClientes(clientesFiltrados);
    } catch (error) {
      console.error("Erro ao filtrar clientes:", error);
      toast({
        title: "Erro ao filtrar clientes",
        description: "Ocorreu um erro ao aplicar os filtros.",
        variant: "destructive"
      });
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleChangeFiltro = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'pontos') {
      const pontos = e.target.value ? parseInt(e.target.value) : undefined;
      setFiltros({
        ...filtros,
        pontos
      });
    } else {
      setFiltros({
        ...filtros,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const limparFiltros = () => {
    setFiltros({
      nome: '',
      telefone: '',
      codigo_cartao: '',
      pontos: undefined
    });
    carregarClientes();
  };

  // Carregar clientes quando o componente for montado
  React.useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Clientes</CardTitle>
        <CardDescription>
          Lista de todos os clientes cadastrados no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filtro_nome">Nome ou Sobrenome</Label>
              <Input 
                id="filtro_nome" 
                name="nome"
                value={filtros.nome}
                onChange={handleChangeFiltro}
                placeholder="Filtrar por nome"
              />
            </div>
            <div>
              <Label htmlFor="filtro_telefone">Telefone</Label>
              <Input 
                id="filtro_telefone" 
                name="telefone"
                value={filtros.telefone}
                onChange={handleChangeFiltro}
                placeholder="Filtrar por telefone"
              />
            </div>
            <div>
              <Label htmlFor="filtro_codigo">Código do Cartão</Label>
              <Input 
                id="filtro_codigo" 
                name="codigo_cartao"
                value={filtros.codigo_cartao}
                onChange={handleChangeFiltro}
                placeholder="Filtrar por código"
              />
            </div>
            <div>
              <Label htmlFor="filtro_pontos">Pontuação</Label>
              <Input 
                id="filtro_pontos" 
                name="pontos"
                type="number"
                min="0"
                max="10"
                value={filtros.pontos === undefined ? '' : filtros.pontos}
                onChange={handleChangeFiltro}
                placeholder="Filtrar por pontos"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
            <Button onClick={aplicarFiltros} disabled={loadingClientes}>
              Aplicar Filtros
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <ClientesTable clientes={clientes} carregando={loadingClientes} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientesConsulta;
