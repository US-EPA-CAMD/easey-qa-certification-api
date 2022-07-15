import { EntityRepository, Repository } from 'typeorm';
import { Component } from '../entities/workspace/component.entity';

@EntityRepository(Component)
export class ComponentWorkspaceRepository extends Repository<Component> {}
