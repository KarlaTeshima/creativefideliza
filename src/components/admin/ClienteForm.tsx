
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cadastrarCliente } from '@/lib/supabaseClient';

const ClienteForm = ({ onClienteAdded }: { onClienteAdded: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    codigo_cartao: ''
  });

  const handleChangeCadastro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormCadastro({
      ...formCadastro,
      [e.target.name]: e.target.value
    });
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
      
      // Notify parent component
      onClienteAdded();
      
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

  return (
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
  );
};

export default ClienteForm;
