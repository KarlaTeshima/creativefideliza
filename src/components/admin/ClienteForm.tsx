
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cadastrarCliente, buscarCliente } from '@/lib/supabaseClient';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClienteFormProps {
  onClienteAdded: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ onClienteAdded }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    codigo_cartao: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Gera código automaticamente para o cliente
  const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Gerar código automaticamente se não for fornecido
    const dadosSubmit = {
      ...formData,
      codigo_cartao: formData.codigo_cartao || generateRandomCode()
    };
    
    setLoading(true);
    
    try {
      // Verificar se o telefone já existe
      const clienteExistente = await buscarCliente(formData.telefone);
      if (clienteExistente) {
        toast({
          title: "Telefone já cadastrado",
          description: "Este número de telefone já está cadastrado no sistema.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      await cadastrarCliente(dadosSubmit);
      
      toast({
        title: "Cliente cadastrado com sucesso",
        description: "Cliente cadastrado com sucesso, 1 ponto foi adicionado."
      });
      
      // Limpar o formulário
      setFormData({
        nome: '',
        sobrenome: '',
        telefone: '',
        codigo_cartao: ''
      });
      
      onClienteAdded();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao cadastrar o cliente.",
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
          Cadastre novos clientes no sistema de fidelidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input 
                id="nome" 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                placeholder="Nome do cliente"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sobrenome">Sobrenome</Label>
              <Input 
                id="sobrenome" 
                name="sobrenome" 
                value={formData.sobrenome} 
                onChange={handleChange} 
                placeholder="Sobrenome do cliente"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input 
              id="telefone" 
              name="telefone" 
              type="tel"
              value={formData.telefone} 
              onChange={handleChange} 
              placeholder="(99) 99999-9999"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="codigo_cartao">Código do Cartão (opcional)</Label>
            <Input 
              id="codigo_cartao" 
              name="codigo_cartao" 
              value={formData.codigo_cartao} 
              onChange={handleChange} 
              placeholder="Código será gerado automaticamente se não preenchido"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Cadastrando..." : "Cadastrar Cliente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClienteForm;
