BEGIN TRANSACTION;

INSERT INTO DimCapacidade (quantidade)
VALUES (100);

INSERT INTO DimIngresso (nome_tipo, preco, descricao, observacao, quantidade_pessoas, ordem)
VALUES 
    ('individual', 60, 'Acesso único completo a todos os dias da EBO', 'Filhos não pagam entrada', 1, 2),
    ('casal', 100, 'Acesso completo para o casal a todos os dias da EBO','Válido para marido e esposa. Filhos não pagam entrada', 2, 1);

INSERT INTO DimCargo (nome)
VALUES
    ('obreiro'),
    ('diácono'),
    ('pastor'),
    ('cooperador'),
    ('membro'),
    ('outro');

INSERT INTO DimCongregacao (nome)
VALUES  
    ('kemel'),
    ('sede'),
    ('amanda i'),
    ('brasilândia'),
    ('capadócia'),
    ('colégio'),
    ('comunitário'),
    ('pq. fernanda'),
    ('eduardo'),
    ('eledy'),
    ('fátima'),
    ('fughiara'),
    ('ipê'),
    ('japão'),
    ('macedônia'),
    ('marabá'),
    ('mimas'),
    ('miraí'),
    ('nova europa'),
    ('rincão'),
    ('são francisco'),
    ('sete lagoas'),
    ('tereza'),
    ('trianon'),
    ('valo verde'),
    ('valquíria'),
    ('varginha'),
    ('mg araxá'),
    ('mg araxá urciano lemos'),
    ('mg divinópolis'),
    ('mg dores de indaiá'),
    ('mg estrela do indaiá'),
    ('mg ibiá'),
    ('mg lagoa da prata'),
    ('mg quartel geral'),
    ('mg rio pomba'),
    ('vila real');


INSERT INTO DimFaq (pergunta, resposta)
VALUES
    ('O ingresso é válido para todos os dias do evento?','Sim! Ao adquirir o seu ingresso, você garante acesso completo aos 4 dias da 19ª EBO.'),
    ('Preciso comprar ingresso para os meus filhos?','Não! É uma alegria para nós receber a sua família. Filhos não pagam entrada e têm acesso gratuito aos dias de evento acompanhados dos pais.'),
    ('Haverá estacionamento no local?', 'Sim, contamos com estacionamento gratuito no local, sujeito à lotação. Recomendamos chegar com pelo menos 30 minutos de antecedência para garantir sua vaga com tranquilidade.');
COMMIT;

CREATE OR REPLACE VIEW vw_credencial_response AS
SELECT
  dc.id, 
  dc.nome, 
  dc.id_transacao, 
  dc.is_titular, 
  dc.id_cargo, 
  dc.id_congregacao,
  dc.is_outra_congregacao,
  dc.nome_outra_congregacao,
  cargo.nome as "nome_cargo",
  cong.nome as "nome_congregacao",
  comp.nome as "nome_comprador",
  comp.email as "email_comprador",
  comp.whatsapp as "whatsapp_comprador",
  ing.nome_tipo as "tipo_ingresso"
FROM dimcredencial dc
INNER JOIN dimcargo cargo ON cargo.id = dc.id_cargo
INNER JOIN dimcongregacao cong ON cong.id = dc.id_congregacao
INNER JOIN facttransacao ft ON ft.id = dc.id_transacao
  INNER JOIN dimcomprador comp ON comp.cpf_cnpj = ft.id_comprador
  INNER JOIN dimingresso ing ON ing.id = ft.id_ingresso

CREATE OR REPLACE VIEW vw_transacao_response AS
SELECT
    ft.id as "id_transacao",
    ft.data_hora_pedido as "data_compra",
    
    jsonb_build_object(
        'status', ft.status_pagamento,
        'metodo_pagamento', ft.metodo_pagamento,
        'valor_total', ft.valor_pedido
    ) AS pagamento,
    
    jsonb_build_object(
        'nome', comp.nome,
        'cpf', comp.cpf_cnpj,
        'email', comp.email
    ) AS comprador,
    
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id_credencial', credencial.id,
                'nome_titular', credencial.nome,
                'tipo_ingresso', ing.nome_tipo,
                
                'nome_cargo', (SELECT cargo.nome FROM dimcargo cargo WHERE cargo.id = credencial.id_cargo),
                'nome_congregacao', (SELECT cong.nome FROM dimcongregacao cong WHERE cong.id = credencial.id_congregacao),
                
                'is_outra_congregacao', credencial.is_outra_congregacao,
                'nome_outra_congregacao', credencial.nome_outra_congregacao,
                

                'checkins', COALESCE(
                    (
                        SELECT jsonb_agg(
                            jsonb_build_object('id', checkin.id, 'data', checkin.data_hora_checkin)
                        ) 
                        FROM factcheckin checkin 
                        WHERE credencial.id = checkin.id_credencial
                    ), 
                    '[]'::jsonb
                )
            )
        ) FILTER (WHERE credencial.id IS NOT NULL), '[]'::jsonb
    ) AS credenciais
FROM facttransacao ft
INNER JOIN dimcomprador comp ON comp.cpf_cnpj = ft.id_comprador
INNER JOIN dimingresso ing ON ing.id = ft.id_ingresso
LEFT JOIN dimcredencial credencial ON ft.id = credencial.id_transacao
GROUP BY 
    ft.id, 
    ft.data_hora_pedido, 
    ft.status_pagamento, 
    ft.metodo_pagamento, 
    ft.valor_pedido, 
    comp.nome, 
    comp.cpf_cnpj, 
    comp.email;


CREATE OR REPLACE VIEW vw_grafico_credenciais_igrejas AS
SELECT 
    cong.nome AS name,
    COUNT(credencial.id) AS "quantidadeCredenciais"
FROM dimcongregacao cong
INNER JOIN dimcredencial credencial ON credencial.id_congregacao = cong.id
GROUP BY cong.nome

CREATE OR REPLACE VIEW vw_grafico_credenciais_cargos AS
SELECT
    carg.nome AS name,
    COUNT(credencial.id) AS qtd
FROM dimcargo carg
INNER JOIN dimcredencial credencial ON credencial.id_cargo = carg.id
GROUP BY carg.nome

CREATE OR REPLACE FUNCTION fn_credenciais_total()
RETURNS SETOF jsonb
LANGUAGE sql
AS $$
    SELECT 
        jsonb_build_object('name', TO_CHAR(data_compra, 'DD/MM'), 'quantidadeTotal', SUM(total_ingresso))
        ||
        jsonb_object_agg(nome_ingresso, total_ingresso)
    FROM (
        SELECT
            DATE(data_hora_pedido AT TIME ZONE 'America/Sao_Paulo') AS data_compra,
            ing.nome_tipo AS nome_ingresso,
            COUNT(ing.id)  AS total_ingresso
        FROM facttransacao trans
        INNER JOIN dimingresso ing ON ing.id = trans.id_ingresso
        WHERE trans.status_pagamento = 'aprovado'
        GROUP BY DATE(data_hora_pedido AT TIME ZONE 'America/Sao_Paulo'), ing.nome_tipo
    ) AS tabela_agregada
    GROUP BY data_compra
    ORDER BY data_compra ASC
$$;

CREATE OR REPLACE VIEW vw_metricas_cards_credenciais AS
SELECT
    COUNT(dc.id) AS "totalCredenciais",
    COUNT(DISTINCT dc.id_congregacao) AS "congregacoesAlcancadas",
    ROUND(
            (
                COUNT(dc.id)::numeric / 
                NULLIF((SELECT quantidade FROM dimcapacidade LIMIT 1)::numeric, 0)
            ) * 100,
        1
    ) AS "lotacaoPercentual"
FROM
    dimcredencial dc

CREATE OR REPLACE VIEW vw_graficos_transacoes AS
SELECT
    ft.id AS id_transacao,
    TO_CHAR(DATE(ft.data_hora_pedido AT TIME ZONE 'America/Sao_Paulo'), 'DD/MM') AS data_pedido,
    ft.valor_pedido AS valor,
    ft.status_pagamento AS status,
    ft.metodo_pagamento,
    ft.id_ingresso,
    cargo.nome AS titular_cargo,
    cong.nome AS titular_congregacao
FROM
    facttransacao ft
LEFT JOIN dimcredencial dc ON dc.id_transacao = ft.id AND dc.is_titular = TRUE
    LEFT JOIN dimcargo cargo ON cargo.id = dc.id_cargo
    LEFT JOIN  dimcongregacao cong ON cong.id = dc.id_congregacao
ORDER BY DATE(ft.data_hora_pedido AT TIME ZONE 'America/Sao_Paulo') ASC;

CREATE OR REPLACE VIEW vw_transacoes_por_status AS
SELECT
    COUNT(id) AS "totalTransacoes",
    COALESCE(SUM(valor_pedido) FILTER (WHERE status_pagamento = 'aprovado'),0) AS "totalArrecadado",
    jsonb_build_object(
        'name', 'pendente',
        'value', COUNT(id) FILTER (WHERE status_pagamento = 'pendente' OR status_pagamento = 'analise')
    ) AS pendente,
    jsonb_build_object(
        'name', 'aprovado',
        'value', COUNT(id) FILTER (WHERE status_pagamento = 'aprovado')
    ) AS aprovado,
    jsonb_build_object(
        'name', 'cancelado',
        'value', COUNT(id) FILTER (WHERE status_pagamento = 'cancelado')
    ) AS cancelado
FROM
    facttransacao;

CREATE OR REPLACE VIEW vw_transacoes_por_ingresso AS
SELECT
    COUNT(dc.id) AS total,
    COUNT(dc.id) FILTER (WHERE di.nome_tipo = 'casal') AS casal,
    COUNT(dc.id) FILTER (WHERE di.nome_tipo != 'casal') AS individual
FROM dimcredencial dc
INNER JOIN facttransacao ft ON ft.id = dc.id_transacao
    INNER JOIN dimingresso di ON di.id = ft.id_ingresso
WHERE dc.is_titular = TRUE;

CREATE OR REPLACE VIEW vw_credenciais_por_congregacao AS
SELECT
    COUNT(dc.id) AS inscritos,
    cong.nome AS name
FROM
    dimcredencial dc
INNER JOIN dimcongregacao cong ON cong.id = dc.id_congregacao
GROUP BY cong.nome;

CREATE OR REPLACE VIEW vw_transacoes_arrecadacao AS
SELECT
    TO_CHAR(DATE(data_hora_pedido AT TIME ZONE 'America/Sao_Paulo'), 'DD/MM') AS name,
    SUM(valor_pedido) FILTER (WHERE status_pagamento = 'aprovado') AS arrecadado,
    COUNT(id) AS vendas
FROM
    facttransacao
GROUP BY DATE(data_hora_pedido AT TIME ZONE 'America/Sao_Paulo')
ORDER BY DATE(data_hora_pedido AT TIME ZONE 'America/Sao_Paulo') ASC;
    

CREATE OR REPLACE FUNCTION fn_registrar_venda_manual(
    p_cpf_cnpj VARCHAR(100),
    email VARCHAR(250),
    whatsapp VARCHAR(250),
    nome VARCHAR(250),
    id_transacao UUID,
    id_ingresso INT,
    id_pagamento_mp VARCHAR(200),
    id_ebo INT,
    status_pagamento enum_status_pagamento,
    metodo_pagamento enum_metodo_pagamento,
    credenciais JSONB
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO dimcomprador(cpf_cnpj, nome, email, whatsapp)
    VALUES (p_cpf_cnpj, nome, email, whatsapp)
    ON CONFLICT (cpf_cnpj) DO UPDATE
    SET nome = EXCLUDED.nome,
        email = EXCLUDED.email,
        whatsapp = EXCLUDED.whatsapp;

    INSERT INTO facttransacao (id, id_comprador, id_ingresso, id_pagamento_mp, 
    id_ebo, status_pagamento, metodo_pagamento, valor_pedido, data_hora_pedido, type)
    VALUES (
        id_transacao, p_cpf_cnpj, id_ingresso, id_pagamento_mp, id_ebo,
        status_pagamento, metodo_pagamento, 
        (SELECT preco FROM dimingresso WHERE id =  id_ingresso), NOW(), 'manual'
    );

    INSERT INTO dimcredencial(nome, id_transacao, id_cargo, 
    id_congregacao, is_outra_congregacao, nome_outra_congregacao, is_titular)
    SELECT
        cred.nome,
        id_transacao,
        cred.id_cargo,
        cred.id_congregacao,
        cred.is_outra_congregacao,
        cred.nome_outra_congregacao,
        cred.is_titular
    FROM 
        jsonb_to_recordset(credenciais)
        AS cred(
            nome VARCHAR(250),
            id_cargo INT,
            id_congregacao INT,
            is_outra_congregacao BOOLEAN,
            nome_outra_congregacao TEXT,
            is_titular BOOLEAN
        );

    RETURN jsonb_build_object(
        'success', true
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'erro', SQLERRM
    );

END; 
$$;


CREATE OR REPLACE FUNCTION fn_registrar_venda(
    p_cpf_cnpj VARCHAR(100),
    email VARCHAR(250),
    whatsapp VARCHAR(250),
    nome VARCHAR(250),
    id_transacao UUID,
    valor_pedido DECIMAL(10,2),
    id_ingresso INT,
    quantidade_pessoas INT,
    id_pagamento_mp VARCHAR(200),
    id_ebo INT,
    status_pagamento enum_status_pagamento,
    metodo_pagamento enum_metodo_pagamento,
    credenciais JSONB
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE dimcapacidade
    SET ocupacao = ocupacao + quantidade_pessoas
    WHERE (ocupacao + quantidade_pessoas) <= quantidade;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false, 
            'code', 'ESGOTADO',
            'erro', 'Não há vagas suficientes para esta quantidade.'
        );
    END IF;

    INSERT INTO dimcomprador(cpf_cnpj, nome, email, whatsapp)
    VALUES (p_cpf_cnpj, nome, email, whatsapp)
    ON CONFLICT (cpf_cnpj) DO UPDATE
    SET nome = EXCLUDED.nome,
        email = EXCLUDED.email,
        whatsapp = EXCLUDED.whatsapp;

    INSERT INTO facttransacao (id, id_comprador, id_ingresso, id_pagamento_mp, 
    id_ebo, status_pagamento, metodo_pagamento, valor_pedido, data_hora_pedido)
    VALUES (
        id_transacao, p_cpf_cnpj, id_ingresso, id_pagamento_mp, id_ebo,
        status_pagamento, metodo_pagamento, valor_pedido, NOW() 
    );

    INSERT INTO cachecredencial(id_transacao, credenciais) 
    VALUES (id_transacao, credenciais);

    RETURN jsonb_build_object(
        'success', true
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'code', 'INTERNO',
        'erro', SQLERRM
    );

END; 
$$;


CREATE OR REPLACE FUNCTION fn_cancelar_venda(
    transacao_id UUID,
    p_metodo_pagamento enum_metodo_pagamento
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_quantidade INT;
BEGIN

    SELECT
        ing.quantidade_pessoas
    INTO 
        v_quantidade
    FROM
        facttransacao ft
    INNER JOIN dimingresso ing ON ft.id_ingresso = ing.id
    WHERE ft.id = transacao_id;

    IF FOUND THEN

        UPDATE
            dimcapacidade
        SET ocupacao = ocupacao - v_quantidade
        WHERE 1 = 1;

        UPDATE
            facttransacao
        SET metodo_pagamento = p_metodo_pagamento,
            status_pagamento = 'cancelado'
        WHERE id = transacao_id;

        DELETE 
        FROM dimcredencial
        WHERE id_transacao = transacao_id;

        DELETE
        FROM cachecredencial
        WHERE id_transacao = transacao_id;

    END IF;

END;
$$;


CREATE OR REPLACE FUNCTION fn_limpar_dados()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_registro RECORD;
BEGIN

    FOR v_registro IN 
        SELECT 
            ft.id,
            ing.quantidade_pessoas 
        FROM 
            facttransacao ft
        INNER JOIN dimingresso ing ON ft.id_ingresso = ing.id
        WHERE ft.status_pagamento = 'pendente' 
          AND ft.data_hora_pedido < NOW() - INTERVAL '10 minutes'
    LOOP
        UPDATE 
            dimcapacidade
        SET 
            ocupacao = ocupacao - v_registro.quantidade_pessoas

        UPDATE 
            facttransacao 
        SET 
            status_pagamento = 'cancelado' 
        WHERE id = v_registro.id;

        DELETE FROM cachecredencial WHERE id_transacao = v_registro.id;
        DELETE FROM dimcredencial WHERE id_transacao = v_registro.id;
    END LOOP;
END;
$$;