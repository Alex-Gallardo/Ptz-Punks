// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";
import "./PlatziPunksDNA.sol";

contract PlatziPunks is ERC721, ERC721Enumerable, PlatziPunksDNA {
    using Counters for Counters.Counter; // Contador de las utilidades de OpenZeppelin
    using Strings for uint256; // Libreria de string, para convertir numeros a string

    Counters.Counter private _idCounter; // Cantidad de platzi punks
    uint256 public maxSupply;
    mapping(uint256 => uint256) public tokenDNA;

    // Constructor
    constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLKS") {
        maxSupply = _maxSupply;
    }

    function mint() public {
        uint256 current = _idCounter.current();
        // require(current < maxSupply, "No PlatziPunks left :(");
        // Da error aqui!
        require(current < maxSupply, "No se puede crear mas platzi punks"); // Validad que el id no sea mayor que el total de platzi punks

        tokenDNA[current] = deterministicPseudoRandomDNA(current, msg.sender); // Generando el DNA
        _safeMint(msg.sender, current);
        _idCounter.increment();
    }

    // Funcion override
    // Lugar o dominio donde esta conectada tu NFT
    function _baseURI() internal pure override returns (string memory) {
        return "https://avataaars.io/";
    }

    function _paramsURI(uint256 _dna) internal view returns (string memory) {
        string memory params;

        {
            params = string(
                abi.encodePacked(
                    "accessoriesType=",
                    getAccessoriesType(_dna),
                    "&clotheColor=",
                    getClotheColor(_dna),
                    "&clotheType=",
                    getClotheType(_dna),
                    "&eyeType=",
                    getEyeType(_dna),
                    "&eyebrowType=",
                    getEyeBrowType(_dna),
                    "&facialHairColor=",
                    getFacialHairColor(_dna),
                    "&facialHairType=",
                    getFacialHairType(_dna),
                    "&hairColor=",
                    getHairColor(_dna),
                    "&hatColor=",
                    getHatColor(_dna),
                    "&graphicType=",
                    getGraphicType(_dna),
                    "&mouthType=",
                    getMouthType(_dna),
                    "&skinColor=",
                    getSkinColor(_dna)
                )
            );
        }

        return string(abi.encodePacked(params, "&topType=", getTopType(_dna)));
    }

    // Retorna la imagen una vez que recibe el DNA
    function imageByDNA(uint256 _dna) public view returns (string memory) {
        // componer la url-base con los parametros que acabamos de construir
        string memory baseURI = _baseURI();
        string memory paramsURI = _paramsURI(_dna);

        return string(abi.encodePacked(baseURI, "?", paramsURI));
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        // Validad que el id sea valido y exista
        require(_exists(tokenId), "El id del platzi punks no es valido");

        uint256 dna = tokenDNA[tokenId];
        string memory image = imageByDNA(dna);

        // Convertimos en numero en string
        string memory jsonURI = Base64.encode(
            abi.encodePacked(
                ' { "name" : "PlatziPunks # ',
                tokenId.toString(),
                '" , "description" : "PlatziPunks es un resultado de avatares al azar" , "image" : "',
                image,
                '" , "symbol" : "PLKS"',
                ' , "tokenId" : "',
                tokenId.toString(),
                '" } '
            )
        );

        // convertirlo a string, porque el abi.encodePacked devuelve un array de bytes
        return
            string(abi.encodePacked("data:application/json;base64,", jsonURI));
    }

    // Esto es necesario de Override
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
