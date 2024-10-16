<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['xmlfile'])) {
    $xmlFile = $_FILES['xmlfile']['tmp_name'];

    if (file_exists($xmlFile)) {
        $xml = simplexml_load_file($xmlFile);

        $emitente = (string)$xml->NFe->infNFe->emit->xNome;
        $dataEmissao = (string)$xml->NFe->infNFe->ide->dhEmi;

        $produtos = [];
        foreach ($xml->NFe->infNFe->det as $produto) {
            $produtos[] = [
                'nome' => (string)$produto->prod->xProd,
                'codigo_barras_comercial' => (string)$produto->prod->cEAN,
                'codigo_barras_tributavel' => (string)$produto->prod->cEANTrib,
                'quantidade' => (float)$produto->prod->qCom,
                'valor_unitario' => (float)$produto->prod->vUnCom,
                'preco' => (float)$produto->prod->vProd,
            ];
        }

        echo json_encode([
            'emitente' => $emitente,
            'dataEmissao' => $dataEmissao,
            'produtos' => $produtos,
        ]);
    } else {
        echo json_encode(['error' => 'Arquivo XML não encontrado.']);
    }
} else {
    echo json_encode(['error' => 'Nenhum arquivo enviado.']);
}
