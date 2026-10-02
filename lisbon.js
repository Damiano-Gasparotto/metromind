// Network as shown in Metropolitano de Lisboa's August 2026 diagram.
// Source: https://www.metrolisboa.pt/wp-content/uploads/2026/08/DiagramaRedeAgosto2026.pdf
// The diagram below is original and schematic; station order defines gameplay.
const LISBON_LINES = {
  AZUL: {color:'#2874bc', badge:'AZ', routes:[
    'Reboleira|Amadora Este|Alfornelos|Pontinha|Carnide|Colégio Militar/Luz|Alto dos Moinhos|Laranjeiras|Jardim Zoológico|Praça de Espanha|São Sebastião|Parque|Marquês de Pombal|Avenida|Restauradores|Baixa-Chiado|Terreiro do Paço|Santa Apolónia'
  ]},
  AMARELA: {color:'#deb12f', badge:'AM', routes:[
    'Odivelas|Senhor Roubado|Ameixoeira|Lumiar|Quinta das Conchas|Campo Grande|Cidade Universitária|Entre Campos|Campo Pequeno|Saldanha|Picoas|Marquês de Pombal|Rato'
  ]},
  VERDE: {color:'#27945a', badge:'VD', routes:[
    'Telheiras|Campo Grande|Alvalade|Roma|Areeiro|Alameda|Arroios|Anjos|Intendente|Martim Moniz|Rossio|Baixa-Chiado|Cais do Sodré'
  ]},
  VERMELHA: {color:'#d5444d', badge:'VM', routes:[
    'Aeroporto|Encarnação|Moscavide|Oriente|Cabo Ruivo|Olivais|Chelas|Bela Vista|Olaias|Alameda|Saldanha|São Sebastião'
  ]}
};

const LISBON_ANCHORS = {
  'Reboleira':[60,420], 'Pontinha':[250,430], 'Colégio Militar/Luz':[405,500],
  'Jardim Zoológico':[560,545], 'São Sebastião':[700,610], 'Marquês de Pombal':[770,700],
  'Baixa-Chiado':[930,825], 'Santa Apolónia':[1160,785],
  'Odivelas':[515,55], 'Campo Grande':[700,330], 'Saldanha':[830,590],
  'Rato':[675,790], 'Telheiras':[560,295], 'Alvalade':[815,345],
  'Alameda':[930,530], 'Rossio':[940,745], 'Cais do Sodré':[850,935],
  'Aeroporto':[1200,160], 'Oriente':[1200,370], 'Bela Vista':[1050,455]
};
