
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onLogin: (password: string) => boolean;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setPassword('');
    }
  };

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
};

export default LoginForm;
