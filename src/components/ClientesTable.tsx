
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Cliente } from '@/lib/supabaseClient';

interface ClientesTableProps {
  clientes: Cliente[];
  carregando?: boolean;
}

const ClientesTable = ({ clientes, carregando = false }: ClientesTableProps) => {
  const formatarData = (data?: string) => {
    if (!data) return '-';
    try {
      return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return data;
    }
  };

  if (carregando) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">Carregando clientes...</p>
      </div>
    );
  }

  if (!clientes.length) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">Nenhum cliente encontrado com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Lista de clientes cadastrados no sistema.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Código do Cartão</TableHead>
          <TableHead className="text-center">Pontos</TableHead>
          <TableHead>Data de Cadastro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">
              {cliente.nome} {cliente.sobrenome}
            </TableCell>
            <TableCell>{cliente.telefone}</TableCell>
            <TableCell>{cliente.codigo_cartao}</TableCell>
            <TableCell className="text-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                ${cliente.pontos === 10 ? 'bg-green-100 text-green-800' : 
                  cliente.pontos >= 7 ? 'bg-amber-100 text-amber-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                {cliente.pontos}
              </span>
            </TableCell>
            <TableCell>{formatarData(cliente.data_cadastro)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientesTable;
