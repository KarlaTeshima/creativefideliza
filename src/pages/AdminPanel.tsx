
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { 
  cadastrarCliente, 
  adicionarPonto, 
  buscarCliente, 
  reiniciarPontos, 
  Cliente, 
  listarClientes,
  buscarClientesComFiltro 
} from '@/lib/supabaseClient';
import ClientesTable from '@/components/ClientesTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminPanel = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Cadastro state
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    codigo_cartao: ''
  });
  
  // Pontos state
  const [termoBusca, setTermoBusca] = useState('');
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  const [pointsAdded, setPointsAdded] = useState(false);
  
  // Consulta clientes state
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [filtros, setFiltros] = useState({
    nome: '',
    telefone: '',
    codigo_cartao: '',
    pontos: undefined as number | undefined
  });

  // Modal de confirmação
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      carregarClientes();
    }
  }, [isAuthenticated]);
  
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
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword('');
    }
  };
  
  const handleChangeCadastro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormCadastro({
      ...formCadastro,
      [e.target.name]: e.target.value
    });
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
  
  const handleCadastrarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await cadastrarCliente(formCadastro);
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: `${formCadastro.nome} foi adicionado ao sistema.`
      });
      
      // Reset form
      setFormCadastro({
        nome: '',
        sobrenome: '',
        telefone: '',
        codigo_cartao: ''
      });
      
      // Recarregar a lista de clientes
      carregarClientes();
      
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao processar o cadastro.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBuscarCliente = async () => {
    if (!termoBusca.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, informe um termo para busca.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setPointsAdded(false);
    
    try {
      const cliente = await buscarCliente(termoBusca);
      setClienteAtual(cliente);
      
      if (!cliente) {
        toast({
          title: "Cliente não encontrado",
          description: "Nenhum cliente encontrado com este termo de busca.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast({
        title: "Erro ao buscar cliente",
        description: "Ocorreu um erro ao buscar o cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdicionarPonto = async () => {
    if (!clienteAtual) return;
    
    setLoading(true);
    
    try {
      const clienteAtualizado = await adicionarPonto(clienteAtual.codigo_cartao);
      
      if (clienteAtualizado) {
        setClienteAtual(clienteAtualizado);
        setPointsAdded(true);
        toast({
          title: "Ponto adicionado com sucesso!",
          description: `${clienteAtualizado.nome} agora possui ${clienteAtualizado.pontos} pontos.`
        });
        
        // Também atualiza a lista de clientes
        carregarClientes();
      }
    } catch (error) {
      console.error("Erro ao adicionar ponto:", error);
      toast({
        title: "Erro ao adicionar ponto",
        description: "Ocorreu um erro ao adicionar o ponto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleReiniciarPontos = async () => {
    if (!clienteAtual) return;
    
    setLoading(true);
    setDialogOpen(false);
    
    try {
      const clienteAtualizado = await reiniciarPontos(clienteAtual.codigo_cartao);
      
      if (clienteAtualizado) {
        setClienteAtual(clienteAtualizado);
        toast({
          title: "Cliente premiado com sucesso!",
          description: "Cartão reiniciado e pronto para reutilização."
        });
        
        // Também atualiza a lista de clientes
        carregarClientes();
      }
    } catch (error) {
      console.error("Erro ao reiniciar pontos:", error);
      toast({
        title: "Erro ao premiar cliente",
        description: "Ocorreu um erro ao reiniciar os pontos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderPointsMessage = () => {
    if (!clienteAtual) return null;
    
    const pontos = clienteAtual.pontos;
    
    if (pontos < 9) {
      return `Este cliente possui ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}. Acumule 10 pontos e seja premiado.`;
    } else if (pontos === 9) {
      return "Este cliente possui 9 pontos. Acumule mais 1 e seja premiado.";
    } else {
      return "Este cliente acumulou 10 pontos e pode receber o prêmio!";
    }
  };
  
  // Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Administrativo</CardTitle>
            <CardDescription>
              Faça login para acessar o painel de administração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha de administrador"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Verificando..." : "Entrar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link to="/">Voltar à página inicial</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-4 px-4 bg-white shadow">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-brand-dark">Painel Administrativo</h1>
            <p className="text-sm text-gray-500">Sistema de Fidelidade</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Início</Link>
            </Button>
            <Button variant="destructive" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-7xl mx-auto py-8 px-4">
        <Tabs defaultValue="cadastro">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cadastro">Cadastro de Cliente</TabsTrigger>
            <TabsTrigger value="pontos">Gerenciamento de Pontos</TabsTrigger>
            <TabsTrigger value="consulta">Consulta de Clientes</TabsTrigger>
          </TabsList>
          
          {/* Cadastro Tab */}
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Cliente</CardTitle>
                <CardDescription>
                  Cadastre um novo cliente no sistema de fidelidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastrarCliente}>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input 
                          id="nome" 
                          name="nome"
                          value={formCadastro.nome}
                          onChange={handleChangeCadastro}
                          placeholder="Nome do cliente"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="sobrenome">Sobrenome</Label>
                        <Input 
                          id="sobrenome" 
                          name="sobrenome"
                          value={formCadastro.sobrenome}
                          onChange={handleChangeCadastro}
                          placeholder="Sobrenome do cliente"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input 
                        id="telefone" 
                        name="telefone"
                        value={formCadastro.telefone}
                        onChange={handleChangeCadastro}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="codigo_cartao">Código do Cartão NFC</Label>
                      <Input 
                        id="codigo_cartao" 
                        name="codigo_cartao"
                        value={formCadastro.codigo_cartao}
                        onChange={handleChangeCadastro}
                        placeholder="Código único do cartão"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="mt-4" disabled={loading}>
                      {loading ? "Cadastrando..." : "Cadastrar Cliente"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pontos Tab */}
          <TabsContent value="pontos">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Pontos</CardTitle>
                <CardDescription>
                  Adicione pontos aos clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="termo_busca">Buscar Cliente</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="termo_busca" 
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder="Nome, telefone ou código do cartão"
                      />
                      <Button 
                        onClick={handleBuscarCliente} 
                        disabled={loading || !termoBusca.trim()}
                      >
                        Buscar
                      </Button>
                    </div>
                  </div>
                  
                  {clienteAtual && (
                    <div className="border rounded-md p-4 bg-white">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Cliente encontrado</h3>
                          <p className="text-sm text-gray-500">
                            {clienteAtual.nome} {clienteAtual.sobrenome} - {clienteAtual.telefone}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Status dos pontos</h4>
                          <p className="text-lg mt-1">{renderPointsMessage()}</p>
                          
                          {/* Avisos baseados na pontuação */}
                          {clienteAtual.pontos === 9 && (
                            <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                              <AlertTitle className="text-amber-600">Atenção</AlertTitle>
                              <AlertDescription className="text-amber-700">
                                Este cliente está a 1 ponto do prêmio!
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {clienteAtual.pontos === 10 && (
                            <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                              <AlertTitle className="text-green-600">Prêmio!</AlertTitle>
                              <AlertDescription className="text-green-700">
                                Este cliente deve receber o prêmio agora.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            onClick={handleAdicionarPonto} 
                            disabled={loading || clienteAtual.pontos >= 10}
                            className="flex-1"
                          >
                            {clienteAtual.pontos >= 10 ? "Máximo de pontos atingido" : "Adicionar Ponto"}
                          </Button>
                          
                          {clienteAtual.pontos === 10 && (
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                              <DialogTrigger asChild>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                  Premiar Cliente e Reiniciar Pontos
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmação</DialogTitle>
                                  <DialogDescription>
                                    Deseja realmente premiar e reiniciar os pontos deste cliente?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={handleReiniciarPontos} disabled={loading}>
                                    Confirmar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Consulta Tab */}
          <TabsContent value="consulta">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
