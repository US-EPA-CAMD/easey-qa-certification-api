import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from '../entities/workspace/component.entity';
import { ComponentWorkspaceRepository } from './component.repository';

@Injectable()
export class ComponentService {}
