-- Dados fictícios para a atividade. Senha de exemplo dos usuários: 123456.
-- A senha abaixo já está em hash bcrypt.
INSERT INTO usuarios (nome, email, senha, perfil) VALUES
('Administrador', 'admin@email.com', '$2b$10$CLSwhMFHCo83rcxjVwFG/O/3oFdjWVl6k6DFuekQaBayEjb0z1oPy', 'admin'),
('Ana Souza', 'ana@email.com', '$2b$10$CLSwhMFHCo83rcxjVwFG/O/3oFdjWVl6k6DFuekQaBayEjb0z1oPy', 'atendente'),
('Pedro Lima', 'pedro@email.com', '$2b$10$CLSwhMFHCo83rcxjVwFG/O/3oFdjWVl6k6DFuekQaBayEjb0z1oPy', 'tecnico')
ON CONFLICT (email) DO NOTHING;

INSERT INTO proprietarios (nome, email, telefone, cpf) VALUES
('Carlos Silva', 'carlos@email.com', '48999990000', '11122233344'),
('Maria Santos', 'maria@email.com', '48988880000', '22233344455'),
('João Oliveira', 'joao@email.com', '48977770000', '33344455566')
ON CONFLICT (email) DO NOTHING;

INSERT INTO veiculos (marca, modelo, placa, ano, cor, "proprietarioId") VALUES
('Volkswagen', 'Gol', 'ABC1D23', 2020, 'Branco', (SELECT id FROM proprietarios WHERE email = 'carlos@email.com')),
('Fiat', 'Uno', 'DEF4G56', 2018, 'Prata', (SELECT id FROM proprietarios WHERE email = 'maria@email.com')),
('Chevrolet', 'Onix', 'GHI7J89', 2022, 'Preto', (SELECT id FROM proprietarios WHERE email = 'joao@email.com'))
ON CONFLICT (placa) DO NOTHING;

INSERT INTO ordens_servico (descricao, "tipoServico", valor, status, "veiculoId")
SELECT 'Lavagem externa do carro', 'Lavagem simples', 40.00, 'aberto', id
FROM veiculos v WHERE placa = 'ABC1D23'
AND NOT EXISTS (SELECT 1 FROM ordens_servico WHERE "veiculoId" = v.id AND descricao = 'Lavagem externa do carro');

INSERT INTO ordens_servico (descricao, "tipoServico", valor, status, "veiculoId")
SELECT 'Lavagem por dentro e por fora', 'Lavagem completa', 80.00, 'em_andamento', id
FROM veiculos v WHERE placa = 'DEF4G56'
AND NOT EXISTS (SELECT 1 FROM ordens_servico WHERE "veiculoId" = v.id AND descricao = 'Lavagem por dentro e por fora');

INSERT INTO ordens_servico (descricao, "tipoServico", valor, status, "veiculoId")
SELECT 'Limpeza dos bancos e carpetes', 'Higienização interna', 150.00, 'concluido', id
FROM veiculos v WHERE placa = 'GHI7J89'
AND NOT EXISTS (SELECT 1 FROM ordens_servico WHERE "veiculoId" = v.id AND descricao = 'Limpeza dos bancos e carpetes');
