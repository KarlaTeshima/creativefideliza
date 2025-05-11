
import { supabase } from "@/integrations/supabase/client";

export interface Cliente {
  id?: string;
  nome: string;
  sobrenome?: string;
  telefone: string;
  codigo_cartao: string;
  pontos: number;
  data_cadastro?: string;
}

// Função para cadastrar um novo cliente
export const cadastrarCliente = async (cliente: Omit<Cliente, 'id' | 'pontos' | 'data_cadastro'>): Promise<Cliente> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{ 
        nome: cliente.nome, 
        sobrenome: cliente.sobrenome || '', 
        telefone: cliente.telefone, 
        codigo_cartao: cliente.codigo_cartao,
        pontos: 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    throw error;
  }
};

// Função para buscar cliente por qualquer campo (código, nome, sobrenome ou telefone)
export const buscarCliente = async (termo: string): Promise<Cliente | null> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`nome.ilike.%${termo}%,sobrenome.ilike.%${termo}%,telefone.ilike.%${termo}%,codigo_cartao.ilike.%${termo}%`)
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return null;
  }
};

// Função para buscar cliente por código de cartão
export const buscarClientePorCodigo = async (codigo: string): Promise<Cliente | null> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('codigo_cartao', codigo)
      .maybeSingle();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar cliente por código:', error);
    return null;
  }
};

// Função para adicionar um ponto ao cliente
export const adicionarPonto = async (codigo: string): Promise<Cliente | null> => {
  try {
    // Primeiro busca o cliente
    const cliente = await buscarClientePorCodigo(codigo);
    
    if (!cliente) return null;
    
    // Atualiza os pontos - limitado a 10
    const { data, error } = await supabase
      .from('clientes')
      .update({ pontos: Math.min(cliente.pontos + 1, 10) })
      .eq('codigo_cartao', codigo)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar ponto:', error);
    return null;
  }
};

// Função para reiniciar os pontos do cliente
export const reiniciarPontos = async (codigo: string): Promise<Cliente | null> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .update({ pontos: 0 })
      .eq('codigo_cartao', codigo)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao reiniciar pontos:', error);
    return null;
  }
};

// Função para listar todos os clientes
export const listarClientes = async (): Promise<Cliente[]> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return [];
  }
};

// Função para buscar clientes com filtros
export const buscarClientesComFiltro = async (filtros: {
  nome?: string, 
  telefone?: string, 
  codigo_cartao?: string, 
  pontos?: number
}): Promise<Cliente[]> => {
  try {
    let query = supabase.from('clientes').select('*');
    
    if (filtros.nome) {
      query = query.or(`nome.ilike.%${filtros.nome}%,sobrenome.ilike.%${filtros.nome}%`);
    }
    
    if (filtros.telefone) {
      query = query.ilike('telefone', `%${filtros.telefone}%`);
    }
    
    if (filtros.codigo_cartao) {
      query = query.ilike('codigo_cartao', `%${filtros.codigo_cartao}%`);
    }
    
    if (filtros.pontos !== undefined) {
      query = query.eq('pontos', filtros.pontos);
    }
    
    const { data, error } = await query.order('data_cadastro', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar clientes com filtro:', error);
    return [];
  }
};
