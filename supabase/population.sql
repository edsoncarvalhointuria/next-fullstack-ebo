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

INSERT INTO DimCongregacao
VALUES  
    ("kemel"),
    ("sede"),
    ("amanda i"),
    ("brasilândia"),
    ("capadócia"),
    ("colégio"),
    ("comunitário"),
    ("pq. fernanda"),
    ("eduardo"),
    ("eledy"),
    ("fátima"),
    ("fughiara"),
    ("ipê"),
    ("japão"),
    ("macedônia"),
    ("marabá"),
    ("mimas"),
    ("miraí"),
    ("nova europa"),
    ("rincão"),
    ("são francisco"),
    ("sete lagoas"),
    ("tereza"),
    ("trianon"),
    ("valo verde"),
    ("valquíria"),
    ("varginha"),
    ("mg araxá"),
    ("mg araxá urciano lemos"),
    ("mg divinópolis"),
    ("mg dores de indaiá"),
    ("mg estrela do indaiá"),
    ("mg ibiá"),
    ("mg lagoa da prata"),
    ("mg quartel geral"),
    ("mg rio pomba"),
    ("vila real");


INSERT INTO DimFaq (pergunta, resposta)
VALUES
    ('O ingresso é válido para todos os dias do evento?','Sim! Ao adquirir o seu ingresso, você garante acesso completo aos 4 dias da 19ª EBO.'),
    ('Preciso comprar ingresso para os meus filhos?','Não! É uma alegria para nós receber a sua família. Filhos não pagam entrada e têm acesso gratuito aos dias de evento acompanhados dos pais.'),
    ('Haverá estacionamento no local?', 'Sim, contamos com estacionamento gratuito no local, sujeito à lotação. Recomendamos chegar com pelo menos 30 minutos de antecedência para garantir sua vaga com tranquilidade.');
COMMIT;