
% load in required data
load('allComponents_lib_updated.mat');
load('GC_data_updated.mat');
load('Ideal_Distillations_v4.mat');

P_tot=101.3;

% protect against matlab crashes from null vars
if exist('n', 'var') ~= 0 && exist('cmp', 'var') ~= 0 && exist('pct', 'var') ~= 0
    
    percentages = cell2mat(pct);
    
    % protect against bad input data
    if sum(percentages) == 1
        
        % define component array
        components=cell(1, n);
        
        % fill array with user input
        for i = 1:n
            components{i}=eval(cmp{i});
        end
        
        % calculate the mixture parameters
        mixture_params=Cmp_Props(components);
        
        % calculate the molecular weight of the component
        C_atoms=mixture_params{5};
        H_atoms=mixture_params{6};
        O_atoms=mixture_params{7};
        MW=C_atoms.*12.01+H_atoms.*1.008+O_atoms.*16;
        
        % calculate the final distributions (recovered, T1)
        T1=distillation(percentages.',mixture_params,GCVOL_GC,Unifac_GC,P_tot);
        recovered=[0;5;10;15;20;25;30;35;40;45;50;55;60;65;70;75;80;85;90;95;99];
        
    end
end