#!/usr/bin/env ts-node
/**
 * DTO vs Schema Consistency Check
 * 
 * Compares DTOs with Mongoose Schemas/Entities to ensure data contract consistency
 * 
 * Generates: reports/dto_schema_diff.md with consistency percentage
 */

import * as fs from 'fs';
import * as path from 'path';
import { Project, SourceFile, ClassDeclaration, PropertyDeclaration } from 'ts-morph';

interface FieldInfo {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  validators: string[];
  decorators: string[];
  defaultValue?: string;
}

interface DtoInfo {
  name: string;
  module: string;
  file: string;
  fields: FieldInfo[];
  purpose?: string; // create, update, etc.
}

interface EntityInfo {
  name: string;
  module: string;
  file: string;
  fields: FieldInfo[];
  isSchema: boolean;
}

interface ComparisonResult {
  dtoName: string;
  entityName: string;
  module: string;
  matchScore: number;
  fieldsInBoth: string[];
  fieldsOnlyInDto: string[];
  fieldsOnlyInEntity: string[];
  typeMismatches: Array<{
    field: string;
    dtoType: string;
    entityType: string;
  }>;
  optionalityMismatches: Array<{
    field: string;
    dtoOptional: boolean;
    entityOptional: boolean;
  }>;
}

class DtoSchemaConsistencyAuditor {
  private project: Project;
  private dtos: DtoInfo[] = [];
  private entities: EntityInfo[] = [];
  private comparisons: ComparisonResult[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
  }

  async audit(): Promise<void> {
    console.log('🔍 Starting DTO vs Schema Consistency Check...\n');

    // 1. Find and parse all DTOs
    await this.parseDtos();

    // 2. Find and parse all Entities/Schemas
    await this.parseEntities();

    // 3. Compare DTOs with Entities
    this.compareAll();

    console.log('\n✅ Analysis complete!\n');

    // 4. Generate report
    this.generateReport();

    console.log('✨ Audit complete!\n');
  }

  /**
   * Parse all DTO files
   */
  private async parseDtos(): Promise<void> {
    console.log('📋 Parsing DTOs...');
    
    const srcPath = path.join(process.cwd(), 'src');
    const dtoFiles = this.findFiles(srcPath, '.dto.ts');
    
    console.log(`  Found ${dtoFiles.length} DTO files`);

    for (const filePath of dtoFiles) {
      const dto = this.parseDtoFile(filePath);
      if (dto) {
        this.dtos.push(dto);
      }
    }

    console.log(`  ✓ Parsed ${this.dtos.length} DTOs\n`);
  }

  /**
   * Parse all Entity/Schema files
   */
  private async parseEntities(): Promise<void> {
    console.log('📋 Parsing Entities/Schemas...');
    
    const srcPath = path.join(process.cwd(), 'src');
    const entityFiles = this.findFiles(srcPath, '.entity.ts');
    
    console.log(`  Found ${entityFiles.length} entity files`);

    for (const filePath of entityFiles) {
      const entity = this.parseEntityFile(filePath);
      if (entity) {
        this.entities.push(entity);
      }
    }

    console.log(`  ✓ Parsed ${this.entities.length} entities\n`);
  }

  /**
   * Find files by extension
   */
  private findFiles(dir: string, extension: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findFiles(fullPath, extension));
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Parse a DTO file
   */
  private parseDtoFile(filePath: string): DtoInfo | null {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      
      const classes = sourceFile.getClasses();
      
      for (const classDecl of classes) {
        const className = classDecl.getName();
        if (!className || !className.includes('Dto')) {
          continue;
        }

        const fields = this.extractFields(classDecl, 'dto');
        const moduleName = this.extractModuleFromPath(filePath);
        const purpose = this.extractDtoPurpose(className);

        this.project.removeSourceFile(sourceFile);

        return {
          name: className,
          module: moduleName,
          file: relativePath,
          fields,
          purpose,
        };
      }

      this.project.removeSourceFile(sourceFile);
    } catch (error) {
      console.error(`  ⚠️  Error parsing ${filePath}:`, error.message);
    }

    return null;
  }

  /**
   * Parse an Entity/Schema file
   */
  private parseEntityFile(filePath: string): EntityInfo | null {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      
      const classes = sourceFile.getClasses();
      
      for (const classDecl of classes) {
        const className = classDecl.getName();
        if (!className) {
          continue;
        }

        // Check if it's a Mongoose schema
        const hasSchemaDecorator = !!classDecl.getDecorator('Schema');
        
        // Skip sub-schemas without main entity
        if (!hasSchemaDecorator && !className.toLowerCase().includes('entity')) {
          continue;
        }

        const fields = this.extractFields(classDecl, 'entity');
        const moduleName = this.extractModuleFromPath(filePath);

        this.project.removeSourceFile(sourceFile);

        return {
          name: className,
          module: moduleName,
          file: relativePath,
          fields,
          isSchema: hasSchemaDecorator,
        };
      }

      this.project.removeSourceFile(sourceFile);
    } catch (error) {
      console.error(`  ⚠️  Error parsing ${filePath}:`, error.message);
    }

    return null;
  }

  /**
   * Extract fields from a class
   */
  private extractFields(classDecl: ClassDeclaration, type: 'dto' | 'entity'): FieldInfo[] {
    const fields: FieldInfo[] = [];
    const properties = classDecl.getProperties();

    for (const prop of properties) {
      const field = this.extractFieldInfo(prop, type);
      if (field) {
        fields.push(field);
      }
    }

    return fields;
  }

  /**
   * Extract field information
   */
  private extractFieldInfo(prop: PropertyDeclaration, type: 'dto' | 'entity'): FieldInfo | null {
    const name = prop.getName();
    if (!name) return null;

    const typeNode = prop.getTypeNode();
    let typeName = typeNode ? typeNode.getText() : 'any';
    
    // Clean up type
    typeName = typeName.replace(/\s+/g, ' ').trim();
    
    const isOptional = prop.hasQuestionToken() || typeName.includes('undefined');
    const isArray = typeName.includes('[]') || typeName.includes('Array<');
    
    // Extract validators
    const validators: string[] = [];
    const decorators: string[] = [];
    
    for (const decorator of prop.getDecorators()) {
      const decoratorName = decorator.getName();
      decorators.push(decoratorName);

      if (type === 'dto') {
        // DTO validators
        if (decoratorName.startsWith('Is') || decoratorName === 'Min' || decoratorName === 'Max') {
          validators.push(decoratorName);
        }
      } else {
        // Entity decorators
        if (decoratorName === 'Prop') {
          // Extract Prop options
          const args = decorator.getArguments();
          if (args.length > 0) {
            const argText = args[0].getText();
            
            if (argText.includes('required: true')) {
              validators.push('required');
            }
            if (argText.includes('unique: true')) {
              validators.push('unique');
            }
            if (argText.includes('enum:')) {
              validators.push('enum');
            }
            if (argText.includes('min:')) {
              validators.push('min');
            }
            if (argText.includes('max:')) {
              validators.push('max');
            }
          }
        }
      }
    }

    // Extract default value
    let defaultValue: string | undefined;
    const initializer = prop.getInitializer();
    if (initializer) {
      defaultValue = initializer.getText();
    }

    return {
      name,
      type: typeName,
      isOptional,
      isArray,
      validators,
      decorators,
      defaultValue,
    };
  }

  /**
   * Extract module name from file path
   */
  private extractModuleFromPath(filePath: string): string {
    const parts = filePath.split(path.sep);
    const modulesIndex = parts.indexOf('modules');
    
    if (modulesIndex !== -1 && modulesIndex + 1 < parts.length) {
      return parts[modulesIndex + 1];
    }

    return 'common';
  }

  /**
   * Extract DTO purpose (create, update, etc.)
   */
  private extractDtoPurpose(className: string): string {
    const lowerName = className.toLowerCase();
    
    if (lowerName.includes('create')) return 'create';
    if (lowerName.includes('update')) return 'update';
    if (lowerName.includes('patch')) return 'patch';
    if (lowerName.includes('filter')) return 'filter';
    if (lowerName.includes('query')) return 'query';
    if (lowerName.includes('search')) return 'search';
    
    return 'other';
  }

  /**
   * Compare all DTOs with Entities
   */
  private compareAll(): void {
    console.log('🔄 Comparing DTOs with Entities...\n');

    for (const dto of this.dtos) {
      // Find matching entity
      const matchingEntity = this.findMatchingEntity(dto);
      
      if (matchingEntity) {
        const comparison = this.compareDtoWithEntity(dto, matchingEntity);
        this.comparisons.push(comparison);
      }
    }

    console.log(`  ✓ Completed ${this.comparisons.length} comparisons`);
  }

  /**
   * Find matching entity for a DTO
   */
  private findMatchingEntity(dto: DtoInfo): EntityInfo | null {
    // Try exact module match first
    const sameModuleEntities = this.entities.filter(e => e.module === dto.module);
    
    if (sameModuleEntities.length === 0) {
      return null;
    }

    // If only one entity in module, use it
    if (sameModuleEntities.length === 1) {
      return sameModuleEntities[0];
    }

    // Try to match by name
    const dtoBaseName = dto.name
      .replace(/Dto$/i, '')
      .replace(/Create/i, '')
      .replace(/Update/i, '')
      .replace(/Add/i, '')
      .toLowerCase();

    for (const entity of sameModuleEntities) {
      const entityBaseName = entity.name
        .replace(/Entity$/i, '')
        .replace(/Schema$/i, '')
        .toLowerCase();

      if (dtoBaseName.includes(entityBaseName) || entityBaseName.includes(dtoBaseName)) {
        return entity;
      }
    }

    // Return first entity in same module as fallback
    return sameModuleEntities[0];
  }

  /**
   * Compare DTO with Entity
   */
  private compareDtoWithEntity(dto: DtoInfo, entity: EntityInfo): ComparisonResult {
    const dtoFields = new Set(dto.fields.map(f => f.name));
    const entityFields = new Set(entity.fields.map(f => f.name));

    const fieldsInBoth: string[] = [];
    const fieldsOnlyInDto: string[] = [];
    const fieldsOnlyInEntity: string[] = [];
    const typeMismatches: ComparisonResult['typeMismatches'] = [];
    const optionalityMismatches: ComparisonResult['optionalityMismatches'] = [];

    // Check fields in DTO
    for (const dtoField of dto.fields) {
      if (entityFields.has(dtoField.name)) {
        fieldsInBoth.push(dtoField.name);

        // Compare types and optionality
        const entityField = entity.fields.find(f => f.name === dtoField.name)!;
        
        if (!this.typesMatch(dtoField.type, entityField.type)) {
          typeMismatches.push({
            field: dtoField.name,
            dtoType: dtoField.type,
            entityType: entityField.type,
          });
        }

        if (dtoField.isOptional !== entityField.isOptional) {
          optionalityMismatches.push({
            field: dtoField.name,
            dtoOptional: dtoField.isOptional,
            entityOptional: entityField.isOptional,
          });
        }
      } else {
        fieldsOnlyInDto.push(dtoField.name);
      }
    }

    // Check fields only in Entity
    for (const entityField of entity.fields) {
      if (!dtoFields.has(entityField.name)) {
        fieldsOnlyInEntity.push(entityField.name);
      }
    }

    // Calculate match score
    const totalFields = Math.max(dtoFields.size, entityFields.size);
    const matchingFields = fieldsInBoth.length;
    const matchScore = totalFields > 0 ? Math.round((matchingFields / totalFields) * 100) : 0;

    return {
      dtoName: dto.name,
      entityName: entity.name,
      module: dto.module,
      matchScore,
      fieldsInBoth,
      fieldsOnlyInDto,
      fieldsOnlyInEntity,
      typeMismatches,
      optionalityMismatches,
    };
  }

  /**
   * Check if types match
   */
  private typesMatch(dtoType: string, entityType: string): boolean {
    // Normalize types
    const normalizeDtoType = dtoType.toLowerCase().replace(/\s+/g, '');
    const normalizeEntityType = entityType.toLowerCase().replace(/\s+/g, '');

    if (normalizeDtoType === normalizeEntityType) {
      return true;
    }

    // Check common type mappings
    const typeMap: Record<string, string[]> = {
      'string': ['string', 'types.objectid', 'objectid'],
      'number': ['number'],
      'boolean': ['boolean', 'bool'],
      'date': ['date'],
      'any': ['any', 'object', 'record'],
    };

    for (const [baseType, variations] of Object.entries(typeMap)) {
      if (variations.some(v => normalizeDtoType.includes(v)) &&
          variations.some(v => normalizeEntityType.includes(v))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate markdown report
   */
  private generateReport(): void {
    const reportPath = path.join(process.cwd(), 'reports', 'dto_schema_diff.md');

    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    let content = '# تقرير اتساق DTO vs Schema\n\n';
    content += `**التاريخ**: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}\n`;
    content += `**الوقت**: ${new Date().toLocaleTimeString('ar-EG')}\n\n`;
    content += '---\n\n';

    // Summary
    content += '## 📊 الملخص العام\n\n';
    content += `- **إجمالي DTOs**: ${this.dtos.length}\n`;
    content += `- **إجمالي Entities**: ${this.entities.length}\n`;
    content += `- **DTOs مع مطابقات**: ${this.comparisons.length}\n`;
    content += `- **DTOs بدون مطابقات**: ${this.dtos.length - this.comparisons.length}\n\n`;

    // Calculate overall consistency
    const totalScore = this.comparisons.reduce((sum, c) => sum + c.matchScore, 0);
    const avgConsistency = this.comparisons.length > 0 ? Math.round(totalScore / this.comparisons.length) : 0;
    
    content += `### نسبة الاتساق الإجمالية: **${avgConsistency}%**\n\n`;
    content += this.generateProgressBar('الاتساق', avgConsistency);
    content += '\n';

    // Issues summary
    const withTypeMismatches = this.comparisons.filter(c => c.typeMismatches.length > 0).length;
    const withOptionalityIssues = this.comparisons.filter(c => c.optionalityMismatches.length > 0).length;
    const withMissingFields = this.comparisons.filter(c => c.fieldsOnlyInDto.length > 0 || c.fieldsOnlyInEntity.length > 0).length;

    content += '### المشاكل المكتشفة\n\n';
    content += `- **اختلافات في الأنواع**: ${withTypeMismatches}\n`;
    content += `- **اختلافات في Optional/Required**: ${withOptionalityIssues}\n`;
    content += `- **حقول مفقودة**: ${withMissingFields}\n\n`;

    // By Module
    content += '## 📦 حسب المودول\n\n';
    
    const byModule = new Map<string, ComparisonResult[]>();
    for (const comp of this.comparisons) {
      if (!byModule.has(comp.module)) {
        byModule.set(comp.module, []);
      }
      byModule.get(comp.module)!.push(comp);
    }

    content += '| المودول | DTOs | متوسط الاتساق | مشاكل |\n';
    content += '|---------|------|---------------|--------|\n';

    for (const [module, comps] of Array.from(byModule.entries()).sort((a, b) => b[1].length - a[1].length)) {
      const avgScore = Math.round(comps.reduce((sum, c) => sum + c.matchScore, 0) / comps.length);
      const issues = comps.filter(c => 
        c.typeMismatches.length > 0 || 
        c.optionalityMismatches.length > 0 ||
        c.fieldsOnlyInDto.length > 0 ||
        c.fieldsOnlyInEntity.length > 0
      ).length;

      content += `| ${module} | ${comps.length} | ${avgScore}% | ${issues} |\n`;
    }
    content += '\n';

    // Top consistency
    content += '## 🏆 أعلى اتساق (Top 10)\n\n';
    const topConsistency = [...this.comparisons]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    content += '| DTO | Entity | المودول | الاتساق |\n';
    content += '|-----|--------|---------|----------|\n';

    for (const comp of topConsistency) {
      content += `| ${comp.dtoName} | ${comp.entityName} | ${comp.module} | ${comp.matchScore}% |\n`;
    }
    content += '\n';

    // Issues
    content += '## ⚠️ المشاكل التي تحتاج إصلاح\n\n';

    const needsFix = this.comparisons.filter(c =>
      c.matchScore < 80 ||
      c.typeMismatches.length > 0 ||
      c.optionalityMismatches.length > 2
    ).sort((a, b) => a.matchScore - b.matchScore);

    if (needsFix.length === 0) {
      content += '_جميع DTOs متسقة مع Schemas!_ 🎉\n\n';
    } else {
      content += `تم العثور على **${needsFix.length}** حالة تحتاج مراجعة:\n\n`;

      for (const comp of needsFix) {
        content += `### ${comp.dtoName} ↔ ${comp.entityName} (${comp.matchScore}%)\n\n`;
        content += `**المودول**: ${comp.module}\n\n`;

        if (comp.typeMismatches.length > 0) {
          content += '**اختلافات في الأنواع**:\n';
          for (const mismatch of comp.typeMismatches) {
            content += `- \`${mismatch.field}\`: DTO=\`${mismatch.dtoType}\` vs Entity=\`${mismatch.entityType}\`\n`;
          }
          content += '\n';
        }

        if (comp.optionalityMismatches.length > 0) {
          content += '**اختلافات في Optional/Required**:\n';
          for (const mismatch of comp.optionalityMismatches) {
            const dtoStatus = mismatch.dtoOptional ? 'optional' : 'required';
            const entityStatus = mismatch.entityOptional ? 'optional' : 'required';
            content += `- \`${mismatch.field}\`: DTO=${dtoStatus} vs Entity=${entityStatus}\n`;
          }
          content += '\n';
        }

        if (comp.fieldsOnlyInDto.length > 0) {
          content += `**حقول في DTO فقط** (${comp.fieldsOnlyInDto.length}): ${comp.fieldsOnlyInDto.join(', ')}\n\n`;
        }

        if (comp.fieldsOnlyInEntity.length > 0) {
          content += `**حقول في Entity فقط** (${comp.fieldsOnlyInEntity.length}): ${comp.fieldsOnlyInEntity.join(', ')}\n\n`;
        }

        content += '---\n\n';
      }
    }

    // Detailed Comparisons
    content += '## 📋 جميع المقارنات\n\n';
    content += '<details>\n<summary>عرض التفاصيل الكاملة</summary>\n\n';
    content += '| DTO | Entity | المودول | الاتساق | مشترك | DTO فقط | Entity فقط | اختلافات نوع |\n';
    content += '|-----|--------|---------|---------|--------|----------|-------------|---------------|\n';

    for (const comp of this.comparisons) {
      content += `| ${comp.dtoName} | ${comp.entityName} | ${comp.module} | `;
      content += `${comp.matchScore}% | ${comp.fieldsInBoth.length} | `;
      content += `${comp.fieldsOnlyInDto.length} | ${comp.fieldsOnlyInEntity.length} | `;
      content += `${comp.typeMismatches.length} |\n`;
    }

    content += '\n</details>\n\n';

    // Recommendations
    content += '## 💡 التوصيات\n\n';

    content += '### 1. إصلاح اختلافات الأنواع\n\n';
    if (withTypeMismatches > 0) {
      content += `يجب مراجعة **${withTypeMismatches}** حالة من اختلافات الأنواع:\n\n`;
      content += '- التأكد من تطابق أنواع البيانات بين DTO و Entity\n';
      content += '- استخدام نفس التعريف للـ Enums\n';
      content += '- مراجعة ObjectId vs string في الـ references\n\n';
    }

    content += '### 2. توحيد Optional/Required\n\n';
    if (withOptionalityIssues > 0) {
      content += `يجب مراجعة **${withOptionalityIssues}** حالة من اختلافات Optional/Required:\n\n`;
      content += '- الحقول المطلوبة في Entity يجب أن تكون required في Create DTOs\n';
      content += '- الحقول الاختيارية في Entity يمكن أن تكون optional في DTOs\n';
      content += '- Update DTOs عادة تكون جميع الحقول optional\n\n';
    }

    content += '### 3. مزامنة الحقول\n\n';
    if (withMissingFields > 0) {
      content += `يجب مراجعة **${withMissingFields}** حالة من الحقول المفقودة:\n\n`;
      content += '- إضافة حقول Entity المفقودة في DTOs (إذا لزم)\n';
      content += '- حذف حقول DTO غير الموجودة في Entity (أو تفسير وجودها)\n';
      content += '- توثيق الحقول computed/virtual المستثناة\n\n';
    }

    content += '### 4. أفضل الممارسات\n\n';
    content += '- **Create DTOs**: يجب أن تحتوي على الحقول المطلوبة فقط\n';
    content += '- **Update DTOs**: جميع الحقول optional باستثناء ID\n';
    content += '- **Response DTOs**: يمكن أن تحتوي على حقول computed إضافية\n';
    content += '- **Validation**: استخدام نفس القواعد في DTO validators و Schema validators\n';
    content += '- **Types**: استخدام Enums مشتركة بين DTOs و Entities\n\n';

    content += '## 📝 خطة العمل\n\n';
    content += `- [ ] مراجعة ${needsFix.length} حالة ذات اتساق منخفض\n`;
    content += `- [ ] إصلاح ${withTypeMismatches} اختلاف في الأنواع\n`;
    content += `- [ ] توحيد ${withOptionalityIssues} حالة optional/required\n`;
    content += '- [ ] توثيق الحقول computed/virtual المستثناة\n';
    content += '- [ ] إضافة unit tests للتحقق من تطابق DTOs مع Entities\n';
    content += '- [ ] إعداد CI check لهذا الفحص\n\n';

    content += '---\n\n';
    content += '_تم إنشاء هذا التقرير تلقائياً بواسطة `tools/audit/dto_schema_diff.ts`_\n';

    fs.writeFileSync(reportPath, content, 'utf-8');
    console.log(`📊 Report generated: ${reportPath}`);
  }

  /**
   * Generate progress bar
   */
  private generateProgressBar(label: string, percent: number): string {
    const barLength = 30;
    const filledLength = Math.round((percent / 100) * barLength);
    const emptyLength = barLength - filledLength;

    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);

    return `**${label}**: [${filled}${empty}] ${percent}%\n`;
  }
}

// Run the audit
const auditor = new DtoSchemaConsistencyAuditor();
auditor.audit().catch((error) => {
  console.error('❌ Error during audit:', error);
  process.exit(1);
});

