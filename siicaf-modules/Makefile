# Makefile para SIICAF - Sistema Inteligente de Análise de Casos
# Autor: SIICAF Team

CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -Iinclude -g
LDFLAGS = -lssl -lcrypto -lcurl

# Diretórios
SRC_DIR = src
INCLUDE_DIR = include
EXAMPLE_DIR = examples
BUILD_DIR = build
OBJ_DIR = $(BUILD_DIR)/obj
BIN_DIR = $(BUILD_DIR)/bin

# Arquivos fonte
SOURCES = $(wildcard $(SRC_DIR)/*.c)
OBJECTS = $(SOURCES:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)

# Exemplos
EXAMPLES = $(wildcard $(EXAMPLE_DIR)/*.c)
EXAMPLE_BINS = $(EXAMPLES:$(EXAMPLE_DIR)/%.c=$(BIN_DIR)/%)

# Biblioteca estática
LIBRARY = $(BUILD_DIR)/libsiicaf.a

# Cores para output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: all clean lib examples install help

# Target padrão
all: lib examples
	@echo "$(GREEN)✓ Compilação concluída com sucesso!$(NC)"
	@echo "$(YELLOW)Biblioteca: $(LIBRARY)$(NC)"
	@echo "$(YELLOW)Exemplos em: $(BIN_DIR)$(NC)"

# Cria diretórios necessários
$(OBJ_DIR) $(BIN_DIR):
	@mkdir -p $@
	@echo "$(GREEN)Criado diretório: $@$(NC)"

# Compila biblioteca estática
lib: $(LIBRARY)

$(LIBRARY): $(OBJECTS) | $(BUILD_DIR)
	@echo "$(YELLOW)Criando biblioteca estática...$(NC)"
	ar rcs $@ $^
	@echo "$(GREEN)✓ Biblioteca criada: $@$(NC)"

# Compila objetos
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	@echo "$(YELLOW)Compilando $<...$(NC)"
	$(CC) $(CFLAGS) -c $< -o $@

# Compila exemplos
examples: $(EXAMPLE_BINS)

$(BIN_DIR)/%: $(EXAMPLE_DIR)/%.c $(LIBRARY) | $(BIN_DIR)
	@echo "$(YELLOW)Compilando exemplo $<...$(NC)"
	$(CC) $(CFLAGS) $< $(LIBRARY) $(LDFLAGS) -o $@
	@echo "$(GREEN)✓ Exemplo compilado: $@$(NC)"

# Executa exemplo completo
run: $(BIN_DIR)/exemplo_completo
	@echo "$(GREEN)Executando exemplo completo...$(NC)"
	@echo ""
	@$<

# Instala biblioteca no sistema (requer root)
install: lib
	@echo "$(YELLOW)Instalando SIICAF...$(NC)"
	install -d /usr/local/include/siicaf
	install -m 644 $(INCLUDE_DIR)/*.h /usr/local/include/siicaf/
	install -m 644 $(LIBRARY) /usr/local/lib/
	ldconfig
	@echo "$(GREEN)✓ SIICAF instalado em /usr/local$(NC)"

# Limpa arquivos compilados
clean:
	@echo "$(RED)Limpando arquivos compilados...$(NC)"
	rm -rf $(BUILD_DIR)
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

# Ajuda
help:
	@echo "═══════════════════════════════════════════════════"
	@echo "  SIICAF - Makefile Help"
	@echo "═══════════════════════════════════════════════════"
	@echo ""
	@echo "Targets disponíveis:"
	@echo ""
	@echo "  make all       - Compila biblioteca e exemplos (padrão)"
	@echo "  make lib       - Compila apenas a biblioteca"
	@echo "  make examples  - Compila apenas os exemplos"
	@echo "  make run       - Executa o exemplo completo"
	@echo "  make install   - Instala biblioteca no sistema (requer root)"
	@echo "  make clean     - Remove arquivos compilados"
	@echo "  make help      - Exibe esta ajuda"
	@echo ""
	@echo "Dependências necessárias:"
	@echo "  - OpenSSL (libssl-dev)"
	@echo "  - libcurl (libcurl4-openssl-dev)"
	@echo ""
	@echo "Exemplo de uso:"
	@echo "  make all && make run"
	@echo ""

# Dependências dos headers
$(OBJ_DIR)/digital_signature.o: $(INCLUDE_DIR)/digital_signature.h
$(OBJ_DIR)/metadata_extractor.o: $(INCLUDE_DIR)/metadata_extractor.h
$(OBJ_DIR)/ai_suggestions.o: $(INCLUDE_DIR)/ai_suggestions.h \
                             $(INCLUDE_DIR)/digital_signature.h \
                             $(INCLUDE_DIR)/metadata_extractor.h
